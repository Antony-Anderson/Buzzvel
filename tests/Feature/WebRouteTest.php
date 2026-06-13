<?php

namespace Tests\Feature;

use Tests\TestCase;

class WebRouteTest extends TestCase
{
    /**
     * Test the welcome page route.
     */
    public function test_welcome_page_returns_successful_response(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    /**
     * Test the application health check route.
     */
    public function test_health_check_returns_successful_response(): void
    {
        $response = $this->get('/up');
        $response->assertStatus(200);
    }
}
