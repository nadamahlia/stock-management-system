<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            // L'utilisateur qui achète
            $table->foreignId('buyer_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Le vendeur propriétaire de l'annonce
            $table->foreignId('seller_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // Le produit commandé
            $table->foreignId('product_id')
                ->nullable()
                ->constrained('products')
                ->nullOnDelete();

            // Informations conservées au moment de l'achat
            $table->string('product_name');
            $table->decimal('price', 12, 2);

            // pending = commande enregistrée, en attente
            $table->string('status')->default('pending');

            $table->timestamps();

            // Un produit ne peut être commandé qu'une seule fois
            $table->unique('product_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};