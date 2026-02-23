<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // ตรวจสอบว่า Login หรือยัง และเป็น Admin หรือไม่
        if (! $request->user() || ! $request->user()->is_admin) {
            return redirect('/'); // หรือ abort(403);
        }

        return $next($request);
    }
}
