<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
class MainController extends Controller
{

   
    public function api()
    {
        return view('api');
    }
   


    public function index()
    {
        return response("Works!", 200);
    }
   
    
    
}
