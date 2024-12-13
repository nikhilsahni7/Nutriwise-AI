// src/app/api/receipes/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Extract search params
    const { searchParams } = new URL(request.url);
    const searchText = searchParams.get('searchText') || 'Indian';

    // Construct the external API URL
    const apiUrl = new URL('https://cosylab.iiitd.edu.in/recipe-search/recipe');
    apiUrl.searchParams.set('pageSize', '30');
    apiUrl.searchParams.set('searchText', searchText);

    // Make the external API request
    const apiResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-api-key': 'cosylab',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    // Log the raw response for debugging
    const responseText = await apiResponse.text();

    // Check if the response is OK
    if (!apiResponse.ok) {
      return NextResponse.json(
        { 
          error: 'Failed to fetch recipes', 
          status: apiResponse.status,
          body: responseText 
        }, 
        { status: apiResponse.status }
      );
    }

    // Parse the response (if not empty)
    const data = responseText ? JSON.parse(responseText) : {};

    // Return the response with CORS headers
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-key'
      }
    });

  } catch (error) {
    console.error('Server-side error fetching recipes:', error);

    // Return a detailed error response
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key'
    }
  });
}