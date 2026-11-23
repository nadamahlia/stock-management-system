<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Enregistrer une commande.
     */
    public function store(Request $request, Product $product)
    {
        $user = $request->user();

        $order = DB::transaction(function () use ($product, $user) {

            // Verrouiller le produit pendant le traitement de l'achat.
            $product = Product::whereKey($product->id)
                ->lockForUpdate()
                ->firstOrFail();

            // Empêcher l'achat de sa propre annonce.
            if ((int) $product->user_id === (int) $user->id) {
                throw ValidationException::withMessages([
                    'purchase' => 'Vous ne pouvez pas acheter votre propre annonce.',
                ]);
            }

            // Vérifier que le produit est disponible.
            if ($product->status !== 'available') {
                throw ValidationException::withMessages([
                    'purchase' => 'Ce produit n’est plus disponible.',
                ]);
            }

            // Vérifier que le produit possède un prix.
            if ($product->price === null) {
                throw ValidationException::withMessages([
                    'purchase' => 'Ce produit ne possède pas encore de prix.',
                ]);
            }

            // Enregistrer la commande.
            $order = Order::create([
                'buyer_id' => $user->id,
                'seller_id' => $product->user_id,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'price' => $product->price,
                'status' => 'pending',
            ]);

            // Marquer le produit comme vendu.
            $product->update([
                'status' => 'sold',
            ]);

            return $order;
        });

        return redirect()
            ->route('orders.index')
            ->with('success', 'Votre commande a été enregistrée avec succès !');
    }

    /**
     * Afficher les achats et les ventes de l'utilisateur connecté.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Mes achats
        $purchases = Order::with(['product', 'seller'])
            ->where('buyer_id', $user->id)
            ->latest()
            ->paginate(15, ['*'], 'purchases_page')
            ->withQueryString();

        // Mes ventes
        $sales = Order::with(['product', 'buyer'])
            ->where('seller_id', $user->id)
            ->latest()
            ->paginate(15, ['*'], 'sales_page')
            ->withQueryString();

        return Inertia::render('Orders/Index', [
            'purchases' => $purchases,
            'sales' => $sales,
        ]);
    }
}
