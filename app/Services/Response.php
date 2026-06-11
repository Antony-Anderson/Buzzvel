<?php

namespace App\Services;

use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class Response
{
    public static function data($data, $code=SymfonyResponse::HTTP_OK){
        return response()->json([
            'success'=>true,
            'type' => 'success',
            'data' => $data
        ], $code);
    }

    public static function success($message, $code=SymfonyResponse::HTTP_OK, $data=null){
        return response()->json([
            'success'=>true,
            'type' => 'success',
            'message' => $message,
            'data' => $data
        ], $code);
    }

    public static function error($message, $code=SymfonyResponse::HTTP_INTERNAL_SERVER_ERROR){
        return response()->json([
            'success'=>false,
            'type' => 'error',
            'message' => $message,
        ], $code);
    }
}
