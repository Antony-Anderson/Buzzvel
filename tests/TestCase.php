<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (config('database.connections.pgsql.database') === 'buzzvel') {
            throw new \Exception('Safety Check: Tests cannot be run on the development database ("buzzvel"). Please create a ".env.testing" file and set a safe database (e.g., DB_DATABASE=buzzvel_test) to avoid wiping your data.');
        }
    }
}
