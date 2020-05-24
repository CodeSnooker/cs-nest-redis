# README

This project is wrapper over the NestJS Redis module. It provides various readymade tailored method to do some few extra redis operations.

For example,

1. Set expiry to midnight
2. Most of the method with Promises with simple resposnse structure
   - Success
   - Failed

## How to use

1. Simply add the RedisModule from 'cs-nest-redis'
2. Inject the RedisRepository class in the desired class to use the module

### Variations

Coming soon

#### Note

By default it connect to DB number of redis. On command line, we can check data using the following commands

```Redis
    // Go to redis command line
    redis-cli

    // Switch the DB
    select 1

    // Now you can verify the records
    get('your key name')

```
