<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->words(3, true);
        return [
            'category_id' => \App\Models\Category::factory(),
            'name' => $this->faker->word(),
            'slug' => $this->faker->unique()->slug(),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->randomFloat(2, 100, 5000),
            'attributes' => [
                'material' => 'High-Grade Polypropylene',
                'color' => $this->faker->safeColorName(),
                'durability' => 'UV Resistant',
            ],
            'stock' => $this->faker->numberBetween(10, 100),
            'is_active' => true,
        ];
    }
}
