# Development CloudFramework in Replit
Following [CloudFramework Instructions](https://www.notion.so/cloudframework/appengine-php-core20-74c573448dc94ebba7e51fc86b8ad9cb) to start programming in localhost execute:

The following instructions have been adapted to replit.com

```shell
# install composer in replit
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"

# install cloudframework php library specialiced for appengine
php composer.phar require cloudframework-io/appengine-php-core-7.4
php vendor/cloudframework-io/appengine-php-core-7.4/install.php replit

# create temporal local data directory: ./local_data/cache and clean cache
php composer.phar clean

# click on run in replit and access:
# To work with APIs. Try now https://{your-url}/training/hello
```
# Access to the API
Use the following url: https://php.cloudframework.repl.co/0-basics/00-hello to test the first end-pont.

You can see the code of the end-point under the folder:
```/api/0-basics/00-hello.php```