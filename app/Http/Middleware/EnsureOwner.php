<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureOwner
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check() || Auth::user()->role !== 'owner') {
            // Untuk request Inertia, return 403 dengan halaman Forbidden
            if ($request->header('X-Inertia')) {
                return inertia('Errors/Forbidden')->toResponse($request)->setStatusCode(403);
            }

            abort(403, 'Akses ditolak. Hanya owner yang dapat mengakses halaman ini.');
        }

        return $next($request);
    }
}
