import { Router } from 'express';
import { prisma } from '../index';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const router = Router();

// ==========================================
// IN-MEMORY HIGH-FIDELITY SANDBOX DATA FALLBACK
// ==========================================
let mockSellers: any[] = [
  {
    id: "seller-marcus",
    userId: "marcus-clerk-id",
    storeName: "Marcus Labs",
    logoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=200&fit=crop",
    description: "Building next-generation developer tooling and production-grade templates.",
    website: "https://marcuslabs.dev",
    socialLinks: { twitter: "marcus_codes", github: "marcus-labs" },
    isVerified: true,
    trustScore: 98,
    revenueTotal: 14250.0,
    followersCount: 142
  },
  {
    id: "seller-elena",
    userId: "elena-clerk-id",
    storeName: "Elena UI/UX",
    logoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&h=200&fit=crop",
    description: "Premium Figma kits, React design systems, and animated landing pages.",
    website: "https://elena.design",
    socialLinks: { twitter: "elena_uiux", github: "elena-designs" },
    isVerified: true,
    trustScore: 99,
    revenueTotal: 8430.0,
    followersCount: 96
  }
];

let mockProducts: any[] = [
  {
    id: "prod-next-saas",
    sellerId: "seller-marcus",
    title: "Next.js SaaS Boilerplate V2",
    description: "Complete production-ready Next.js App Router boilerplate. Pre-configured with Clerk Auth, Prisma PostgreSQL, Stripe payments, Resend email workflows, and a tailwind theme dashboard layout. Build your SaaS MVP in hours instead of weeks.",
    category: "Next.js Projects",
    tags: ["Next.js", "SaaS", "Stripe", "Prisma", "TypeScript"],
    price: 49.00,
    originalPrice: 99.00,
    type: "DIGITAL_DOWNLOAD",
    status: "ACTIVE",
    version: "2.1.0",
    thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop"
    ],
    videoDemoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    techStack: ["Next.js 16", "TypeScript", "Tailwind CSS", "Prisma ORM", "Stripe"],
    features: [
      "Clerk Auth pre-configured",
      "Stripe Subscription Checkout flow & webhooks",
      "Interactive Dashboard analytics template",
      "Resend transactional emails ready",
      "SEO Metadata & Sitemap generators"
    ],
    installGuide: "1. Clone repo\n2. Run `npm install`\n3. Copy `.env.example` to `.env` and fill variables\n4. Run `npx prisma db push`\n5. Run `npm run dev`",
    licensing: "COMMERCIAL",
    fileUrl: "#",
    externalUrl: "https://github.com/marcus-labs/next-saas-boilerplate",
    rating: 4.8,
    downloadsCount: 312,
    createdAt: new Date(Date.now() - 20 * 24 * 3600000).toISOString()
  },
  {
    id: "prod-figma-kit",
    sellerId: "seller-elena",
    title: "Vibrant UI - Figma Design System",
    description: "A premium Figma UI kit built specifically for startup landing pages and dashboard SaaS layouts. Features 300+ responsive components, typography hierarchies, auto-layout 5.0 configuration, variable color themes, and 45 custom screen templates.",
    category: "UI Kits",
    tags: ["Figma", "UI Kit", "Design System", "Startups"],
    price: 29.00,
    originalPrice: 49.00,
    type: "DESIGN_ASSETS",
    status: "ACTIVE",
    version: "1.2.0",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=250&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&h=400&fit=crop"
    ],
    videoDemoUrl: null,
    techStack: ["Figma", "Auto-Layout", "Variables"],
    features: [
      "300+ Nested responsive components",
      "Auto-Layout 5.0 set up on all grids",
      "Light and Dark mode style variables",
      "45 Responsive page mockup templates",
      "Free lifetime updates"
    ],
    installGuide: "1. Download the file\n2. Drag and drop the `.fig` file directly into your Figma workspace",
    licensing: "PERSONAL",
    fileUrl: "#",
    externalUrl: null,
    rating: 4.9,
    downloadsCount: 184,
    createdAt: new Date(Date.now() - 10 * 24 * 3600000).toISOString()
  },
  {
    id: "prod-saas-mvp",
    sellerId: "seller-marcus",
    title: "I will build your SaaS MVP in 14 days",
    description: "Are you a founder looking to build a functional SaaS MVP quickly? Skip the developer hiring headaches. I specialize in building rapid, high-performance web applications using Next.js, Tailwind CSS, Clerk, and PostgreSQL. Let's get your product ready to launch in 2 weeks.",
    category: "Agencies",
    tags: ["Freelance", "Next.js", "MVP Builder", "SaaS Development"],
    price: 1999.00,
    originalPrice: 2499.00,
    type: "SERVICE",
    status: "ACTIVE",
    version: "1.0.0",
    thumbnailUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=250&fit=crop",
    screenshots: [],
    videoDemoUrl: null,
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Tailwind CSS"],
    features: [
      "Custom UI Design & Architecture mapping",
      "Core database modeling and schemas setup",
      "Authentication and User roles integration",
      "Stripe payment/sub gateways setup",
      "Deployment to Vercel/AWS"
    ],
    installGuide: "After purchase, you will receive a scheduler invite link. We will hold a 45-minute scope alignment kick-off call to kick off the development.",
    licensing: "CUSTOM",
    fileUrl: null,
    externalUrl: null,
    rating: 5.0,
    downloadsCount: 12,
    createdAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
    isService: true,
    servicePackages: {
      basic: { price: 1999, deliveryDays: 14, revisions: 3, specs: ["1-4 Core page layouts", "Clerk Authentication integration", "1 Payment gateway setup", "Deployment support"] },
      standard: { price: 2999, deliveryDays: 21, revisions: 5, specs: ["1-8 Core layouts", "Authentication + User roles DB setups", "Stripe payment subscription systems", "SendGrid email templates integration", "1 Custom API integration"] },
      premium: { price: 4499, deliveryDays: 30, revisions: 99, specs: ["Unlimited pages", "Complete database schemas & relationships", "Advanced billing subscriptions", "Multi-Agent AI / LLM workflows integration", "Full developer handoff & 30-day post launch support"] }
    },
    faqs: [
      { q: "What technologies do you build with?", a: "I build exclusively with Next.js, Node.js, Tailwind CSS, PostgreSQL, Prisma, and Clerk for authentication." },
      { q: "Do you offer post-launch maintenance?", a: "Yes, standard and premium packages include a support buffer, and custom retainers can be scheduled." }
    ]
  }
];

let mockReviews: any[] = [
  { id: "rev-1", productId: "prod-next-saas", userId: "user-1", userName: "Sarah Chen", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop", rating: 5, comment: "This saved me easily 40 hours of work setting up Stripe webhooks and Clerk custom claims. Highly recommend it!", sellerReply: "Thanks Sarah! Glad it saved you time.", createdAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString() },
  { id: "rev-2", productId: "prod-figma-kit", userId: "user-2", userName: "Jason Sterling", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop", rating: 4, comment: "Incredibly clean component libraries. Auto layout is perfectly configured. A few components were missing variants, but overall excellent value.", sellerReply: "Thanks Jason. Variant updates are incoming in v1.3 next week!", createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString() }
];

let mockOrders: any[] = [];
let mockCoupons: any[] = [
  { code: "FOUNDER10", discountPct: 10, isActive: true },
  { code: "ECOSYSTEM30", discountPct: 30, isActive: true }
];

// Helper to find DB User
async function getDBUser(clerkId: string) {
  try {
    return await prisma.user.findUnique({ where: { clerkId } });
  } catch (e) {
    return null;
  }
}

// ==========================================
// REST CONTROLLERS
// ==========================================

// 1. Get Product Catalog with Filters & Search
router.get('/products', async (req, res) => {
  try {
    const { category, search, tag, free, premium, verified, sort } = req.query;
    
    // Attempt DB query
    try {
      const dbProducts = await (prisma as any).marketplaceProduct.findMany({
        where: {
          status: 'ACTIVE',
          ...(category ? { category: String(category) } : {}),
          ...(tag ? { tags: { has: String(tag) } } : {}),
          ...(free === 'true' ? { price: 0 } : {}),
          ...(premium === 'true' ? { price: { gt: 0 } } : {})
        },
        include: {
          seller: true,
          reviews: true
        }
      });
      if (dbProducts.length > 0) {
        return res.json(dbProducts);
      }
    } catch (dbErr) {
      // Fallback silently to mock database
    }

    // In-memory filter processing
    let products = [...mockProducts];

    if (category) {
      products = products.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
    }

    if (tag) {
      products = products.filter(p => p.tags.map((t: string) => t.toLowerCase()).includes(String(tag).toLowerCase()));
    }

    if (free === 'true') {
      products = products.filter(p => p.price === 0);
    } else if (premium === 'true') {
      products = products.filter(p => p.price > 0);
    }

    if (search) {
      const s = String(search).toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(s) || 
        p.description.toLowerCase().includes(s) || 
        p.tags.some((t: string) => t.toLowerCase().includes(s))
      );
    }

    if (verified === 'true') {
      products = products.filter(p => {
        const seller = mockSellers.find(s => s.id === p.sellerId);
        return seller?.isVerified;
      });
    }

    // Sorting
    if (sort === 'price_low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else {
      products.sort((a, b) => b.downloadsCount - a.downloadsCount); // Best sellers (popularity) default
    }

    // Map seller object onto response
    const payload = products.map(p => {
      const seller = mockSellers.find(s => s.id === p.sellerId);
      return {
        ...p,
        seller
      };
    });

    res.json(payload);
  } catch (error) {
    console.error('Marketplace Products GET Error:', error);
    res.status(500).json({ error: 'Failed to fetch marketplace products' });
  }
});

// 2. Fetch specific product detail
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // DB Check
    try {
      const dbProduct = await (prisma as any).marketplaceProduct.findUnique({
        where: { id },
        include: { seller: true, reviews: { include: { user: true } } }
      });
      if (dbProduct) return res.json(dbProduct);
    } catch (e) {}

    // Mock search
    const product = mockProducts.find(p => p.id === id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const seller = mockSellers.find(s => s.id === product.sellerId);
    const reviews = mockReviews.filter(r => r.productId === product.id);

    res.json({
      ...product,
      seller,
      reviews
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

// 3. Upload new product
router.post('/products', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const dbUser = await getDBUser(auth.userId);
    const userId = dbUser?.id || "user-temp-id";

    const { title, description, category, tags, price, originalPrice, type, thumbnailUrl, installGuide, fileUrl, externalUrl, isService, servicePackages, faqs } = req.body;

    if (!title || !description || !category || price === undefined) {
      return res.status(400).json({ error: 'Missing title, description, category, or price' });
    }

    // Verify or find seller profile
    let seller: any = mockSellers.find(s => s.userId === auth.userId);
    if (!seller) {
      // Auto-create a mock seller profile for user
      seller = {
        id: `seller-${Date.now()}`,
        userId: auth.userId,
        storeName: dbUser?.name ? `${dbUser.name} Hub` : "New Creator Store",
        logoUrl: dbUser?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop",
        bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=200&fit=crop",
        description: "Creator store on FounderX Marketplace.",
        website: "",
        socialLinks: {},
        isVerified: false,
        trustScore: 100,
        revenueTotal: 0,
        followersCount: 0
      };
      mockSellers.push(seller);
    }

    const newProd = {
      id: `prod-${Date.now()}`,
      sellerId: seller.id,
      title,
      description,
      category,
      tags: tags || [],
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      type: type || "DIGITAL_DOWNLOAD",
      status: "ACTIVE",
      version: "1.0.0",
      thumbnailUrl: thumbnailUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      screenshots: [],
      videoDemoUrl: null,
      techStack: tags || [],
      features: ["Easy integration", "Documentation included"],
      installGuide: installGuide || "Standard guidelines apply.",
      licensing: "COMMERCIAL",
      fileUrl: fileUrl || "#",
      externalUrl: externalUrl || null,
      rating: 5.0,
      downloadsCount: 0,
      createdAt: new Date().toISOString(),
      ...(isService ? { isService: true, servicePackages, faqs } : {})
    };

    mockProducts.unshift(newProd);

    // Save in DB if available
    try {
      await (prisma as any).marketplaceProduct.create({
        data: {
          sellerId: seller.id,
          title,
          description,
          category,
          tags: tags || [],
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : null,
          type: type || "DIGITAL_DOWNLOAD",
          status: "ACTIVE",
          thumbnailUrl: thumbnailUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
          licensing: "COMMERCIAL"
        }
      });
    } catch (e) {}

    res.status(201).json({ ...newProd, seller });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ error: 'Failed to upload product' });
  }
});

// 4. Validate Coupon code
router.get('/coupons/validate', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'Code is required' });

  const coupon = mockCoupons.find(c => c.code.toUpperCase() === String(code).toUpperCase() && c.isActive);
  if (!coupon) return res.status(404).json({ error: 'Invalid or expired coupon code' });

  res.json(coupon);
});

// 5. Checkout Cart Items
router.post('/checkout', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const { items, couponCode } = req.body; // array of productIds

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart items are empty' });
    }

    const boughtProds = mockProducts.filter(p => items.includes(p.id));
    if (boughtProds.length === 0) return res.status(404).json({ error: 'Items not found' });

    let discountPct = 0;
    if (couponCode) {
      const coupon = mockCoupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive);
      if (coupon) discountPct = coupon.discountPct;
    }

    const subtotal = boughtProds.reduce((acc, curr) => acc + curr.price, 0);
    const discountAmount = subtotal * (discountPct / 100);
    const total = subtotal - discountAmount;

    // Generate Order Details
    const orderId = `order-${Date.now()}`;
    const invoiceId = `INV-${Date.now().toString().slice(-6)}`;
    const licenses = boughtProds.map(p => ({
      productId: p.id,
      productTitle: p.title,
      licenseKey: `LIC-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      downloadUrl: `/api/marketplace/download/${p.id}`
    }));

    // Update Seller Total revenue in mock memory
    boughtProds.forEach(p => {
      const seller = mockSellers.find(s => s.id === p.sellerId);
      if (seller) {
        seller.revenueTotal += p.price * (1 - (discountPct / 100));
      }
      p.downloadsCount += 1;
    });

    const orderObj = {
      id: orderId,
      invoiceId,
      subtotal,
      discountAmount,
      total,
      couponCode,
      licenses,
      createdAt: new Date().toISOString()
    };

    mockOrders.push(orderObj);

    res.status(201).json(orderObj);
  } catch (error) {
    res.status(500).json({ error: 'Checkout failed' });
  }
});

// 6. Fetch Seller Store details
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = mockSellers.find(s => s.id === sellerId);
    if (!seller) return res.status(404).json({ error: 'Seller store not found' });

    const products = mockProducts.filter(p => p.sellerId === sellerId);
    const reviews = mockReviews.filter(r => products.some(p => p.id === r.productId));

    res.json({
      seller,
      products,
      reviews
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch seller store details' });
  }
});

// 7. Seller Dashboard statistics
router.get('/seller-dashboard/analytics', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const auth = (req as any).auth;
    const seller = mockSellers.find(s => s.userId === auth.userId);
    
    if (!seller) {
      // Empty dashboard default
      return res.json({
        revenue: 0,
        orders: 0,
        downloads: 0,
        views: 0,
        conversionRate: 0,
        monthlyRevenue: [0, 0, 0, 0, 0, 0],
        recentSales: []
      });
    }

    const sellerProducts = mockProducts.filter(p => p.sellerId === seller.id);
    const downloadsTotal = sellerProducts.reduce((acc, curr) => acc + curr.downloadsCount, 0);

    // Mock dashboard metrics
    res.json({
      revenue: seller.revenueTotal,
      orders: Math.round(downloadsTotal * 0.8),
      downloads: downloadsTotal,
      views: downloadsTotal * 5,
      conversionRate: 16.4,
      monthlyRevenue: [
        Math.round(seller.revenueTotal * 0.1),
        Math.round(seller.revenueTotal * 0.15),
        Math.round(seller.revenueTotal * 0.22),
        Math.round(seller.revenueTotal * 0.18),
        Math.round(seller.revenueTotal * 0.25),
        Math.round(seller.revenueTotal * 0.3)
      ],
      recentSales: [
        { id: "sale-1", buyerName: "Alex Rivera", productTitle: sellerProducts[0]?.title || "boilerplate", price: sellerProducts[0]?.price || 49, date: "2 hours ago" },
        { id: "sale-2", buyerName: "Maya Patel", productTitle: sellerProducts[1]?.title || "UI Kit", price: sellerProducts[1]?.price || 29, date: "Yesterday" }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

// 8. Submit Verification Request
router.post('/seller-dashboard/verify', ClerkExpressRequireAuth({}), (req, res) => {
  const auth = (req as any).auth;
  const { businessName, documentUrl } = req.body;

  const seller = mockSellers.find(s => s.userId === auth.userId);
  if (seller) {
    // Flag verification as pending
    (seller as any).verificationPending = true;
  }

  res.status(200).json({ success: true, message: "Verification request submitted for admin review." });
});

// 9. Admin panel dashboard metrics
router.get('/admin/analytics', ClerkExpressRequireAuth({}), (req, res) => {
  const totalRevenue = mockSellers.reduce((acc, curr) => acc + curr.revenueTotal, 0);
  res.json({
    platformRevenue: totalRevenue * 0.15, // 15% Platform take-rate commission
    commissionRate: 15,
    sellerCount: mockSellers.length,
    productCount: mockProducts.length,
    pendingVerifications: mockSellers.filter(s => !(s.isVerified)).map(s => ({
      id: s.id,
      storeName: s.storeName,
      trustScore: s.trustScore,
      createdAt: s.createdAt
    }))
  });
});

// 10. Update Review
router.post('/reviews', ClerkExpressRequireAuth({}), (req, res) => {
  const { productId, rating, comment } = req.body;
  if (!productId || !rating || !comment) {
    return res.status(400).json({ error: 'Missing productId, rating, or comment' });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    productId,
    userId: "curr-user-id",
    userName: "Test User",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop",
    rating: Number(rating),
    comment,
    sellerReply: null,
    createdAt: new Date().toISOString()
  };

  mockReviews.unshift(newReview);
  res.status(201).json(newReview);
});

export default router;
