import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { isAdminRequestAuthorized } from '@/lib/admin-auth'

function isAdmin(req: NextRequest): boolean {
  return isAdminRequestAuthorized(req.cookies.get('adminToken')?.value)
}

export async function GET(req: NextRequest) {
  try {
    const allProducts = await db
      .select({
        id: products.id,
        slug: products.slug,
        title: products.title,
        price: products.price,
        description: products.description,
        short_description: products.short_description,
        category_id: products.category_id,
        brand: products.brand,
        stock_quantity: products.stock_quantity,
        featured: products.featured,
        bestseller: products.bestseller,
        active: products.active,
        archived: products.archived,
        image: products.image,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .orderBy(desc(products.createdAt))
    return NextResponse.json(allProducts)
  } catch (error) {
    console.error('[Get Products Error]', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      title,
      slug,
      price,
      description,
      short_description,
      category_id,
      brand,
      stock_quantity,
      featured,
      bestseller,
      active,
    } = body

    if (!title || !slug || price === undefined) {
      return NextResponse.json({ error: 'Title, slug, and price required' }, { status: 400 })
    }

    const result = await db
      .insert(products)
      .values({
        title,
        slug,
        price,
        description,
        short_description,
        category_id,
        brand,
        stock_quantity: stock_quantity || 0,
        featured: featured || false,
        bestseller: bestseller || false,
        active: active !== false,
      })
      .returning()

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('[Create Product Error]', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
