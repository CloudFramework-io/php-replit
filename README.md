# Development CloudFramework in Replit
Following [CloudFramework Instructions](https://www.notion.so/cloudframework/appengine-php-core20-74c573448dc94ebba7e51fc86b8ad9cb) to start programming in localhost

CloudFramwork Academy Instructions can be found [here](https://www.notion.so/BACKEND-PHP-7-4-OPTIMIZED-FOR-APPENGINE-STANDARD-AND-CLOUDFUNCTIONS-160765f1db5a41fda8aedea6628e6cd1)

The following instructions have been adapted to replit.com

```shell
# INSTALL cloudframework php library specialiced for appengine
# selection php74 packages
composer require cloudframework-io/appengine-php-core-7.4

# INSTALL basic files and directories
php vendor/cloudframework-io/appengine-php-core-7.4/install.php replit

# CLICK on run in replit and access:
# To work with APIs. Try now https://{your-replit-url}/training/hello
```
# Access to the API
For original project you can access to: https://{your-replit-url}/0-basics/00-hello to test the first end-pont.

```
{"success":true,"status":200,"code":"ok","time_zone":"UTC","data":"hello World","logs":"only restful.logs.allowed_ips. Current ip: X.X.X.X"}
```


You can see the code of the end-point under the folder:
```/api/00-basics/00-hello.php```