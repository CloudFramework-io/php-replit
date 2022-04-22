<?php
# Installation to setup a replit.com php web server
# https://replit.com/@cloudframework/php#index.php
# php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
# php composer-setup.php
# php -r "unlink('composer-setup.php');"
# php composer.phar require cloudframework-io/appengine-php-core-7.4
# php vendor/cloudframework-io/appengine-php-core-7.4/replit.php
# php composer.phar update

$_root_path = (strlen($_SERVER['DOCUMENT_ROOT'])) ? $_SERVER['DOCUMENT_ROOT'] : $_SERVER['PWD'];

echo "---------\n";
echo "Installing CloudFramework GCP for PHP for replit.com\n";
echo "---------\n";

echo " - mkdir ./local_data/cache\n";
if(!is_dir("./local_data")) mkdir($_root_path.'/local_data');
if(!is_dir("./local_data/cache")) mkdir($_root_path.'/local_data/cache');
if(!is_dir("./local_data/cache")) die('ERROR trying to create [./local_data/cache]. Verify privileges');

echo " - Rewriting composer.json\n";
copy("vendor/cloudframework-io/appengine-php-core-7.4/composer-dist.json", "./composer.json");

echo " - Copying /api examples\n";
if(!is_dir("./api")) mkdir('api');
shell_exec("cp -Ra vendor/cloudframework-io/appengine-php-core-7.4/api-dist/* api");

if(!is_file('./config.json')) {
    echo " - Copying composer.json\n";
    copy("vendor/cloudframework-io/appengine-php-core-7.4/config-dist.json", "./config.json");
} else echo " - Already exist config.json\n";

if(!is_file('./README.md')) {
    echo " - Copying README.md\n";
    copy("vendor/cloudframework-io/appengine-php-core-7.4/README-dist.md", "./README.md");
} else echo " - Already exist README.md\n";

echo " - Creating index.php\n";
shell_exec('echo "<?php include \"vendor/cloudframework-io/appengine-php-core-7.4/src/dispatcher.php\";" > index.php');
