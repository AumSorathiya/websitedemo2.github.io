import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCourseSchema, insertEnrollmentSchema, insertNewsletterSchema, insertTestimonialSchema } from "@shared/schema";

// Email generation function
function generateOrderEmail(orderId: string, customer: any, items: any[], totals: any, orderDate: string) {
  const itemsList = items.map(item => 
    `• ${item.title} - Quantity: ${item.quantity} - Price: $${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');
  
  return `
🎉 STYLEHUB ORDER CONFIRMATION 🎉
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order ID: ${orderId}
Order Date: ${new Date(orderDate).toLocaleString()}

CUSTOMER DETAILS:
━━━━━━━━━━━━━━━━
Name: ${customer.firstName} ${customer.lastName}
Email: ${customer.email}
Phone: ${customer.phone}

SHIPPING ADDRESS:
━━━━━━━━━━━━━━━━
${customer.address}
${customer.city}, ${customer.state} ${customer.zip}
${customer.country}

PAYMENT METHOD:
━━━━━━━━━━━━━━━━
Card: **** **** **** ${customer.cardNumber.slice(-4)}
Cardholder: ${customer.cardholder}

ORDER ITEMS:
━━━━━━━━━━━━━━━━
${itemsList}

ORDER SUMMARY:
━━━━━━━━━━━━━━━━
Subtotal: $${totals.subtotal.toFixed(2)}
Shipping: $${totals.shipping.toFixed(2)}
Tax: $${totals.tax.toFixed(2)}
━━━━━━━━━━━━━━━━
TOTAL: $${totals.total.toFixed(2)}

Thank you for shopping with StyleHub!
Your order will be processed within 2-3 business days.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
StyleHub - Fashion Forward
www.stylehub.com | support@stylehub.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
}

// Simulate email sending (in production, use actual email service)
async function simulateEmailSend(emailContent: string, customer: any, orderId: string) {
  // Log the email for demo purposes
  console.log('\n' + '='.repeat(80));
  console.log('📧 EMAIL SENT TO: mdsorathiya56@gmail.com');
  console.log('📧 ORDER ID:', orderId);
  console.log('📧 CUSTOMER:', customer.firstName + ' ' + customer.lastName);
  console.log('='.repeat(80));
  console.log(emailContent);
  console.log('='.repeat(80) + '\n');
  
  // In a real implementation, you would integrate with:
  // - SendGrid: https://sendgrid.com/
  // - Nodemailer: https://nodemailer.com/
  // - AWS SES: https://aws.amazon.com/ses/
  // - Mailgun: https://www.mailgun.com/
  
  return Promise.resolve(true);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Product routes (renamed from courses)
  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.getCourses(); // Reusing courses table for products
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await storage.getCourse(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });

  app.post('/api/products', async (req, res) => {
    try {
      const productData = insertCourseSchema.parse(req.body);
      const product = await storage.createCourse(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: 'Invalid product data' });
    }
  });

  // Cart routes (renamed from enrollments)
  app.post('/api/cart', async (req, res) => {
    try {
      const cartData = insertEnrollmentSchema.parse({
        userId: req.body.userId,
        courseId: req.body.productId
      });
      const cartItem = await storage.enrollUserInCourse(cartData);
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(400).json({ error: 'Failed to add to cart' });
    }
  });

  app.get('/api/users/:userId/cart', async (req, res) => {
    try {
      const cartItems = await storage.getUserEnrollments(parseInt(req.params.userId));
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cart items' });
    }
  });

  // Newsletter routes
  app.post('/api/newsletter/subscribe', async (req, res) => {
    try {
      const newsletterData = insertNewsletterSchema.parse(req.body);
      const subscription = await storage.subscribeToNewsletter(newsletterData);
      res.status(201).json({ message: 'Successfully subscribed to newsletter', subscription });
    } catch (error) {
      if (error instanceof Error && error.message?.includes('duplicate')) {
        return res.status(409).json({ error: 'Email already subscribed' });
      }
      res.status(400).json({ error: 'Failed to subscribe to newsletter' });
    }
  });

  app.post('/api/newsletter/unsubscribe', async (req, res) => {
    try {
      const { email } = req.body;
      const success = await storage.unsubscribeFromNewsletter(email);
      if (success) {
        res.json({ message: 'Successfully unsubscribed from newsletter' });
      } else {
        res.status(404).json({ error: 'Email not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to unsubscribe from newsletter' });
    }
  });

  // Testimonial routes
  app.get('/api/testimonials', async (req, res) => {
    try {
      const testimonials = await storage.getApprovedTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
  });

  app.post('/api/testimonials', async (req, res) => {
    try {
      const testimonialData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(testimonialData);
      res.status(201).json(testimonial);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create testimonial' });
    }
  });

  // Statistics endpoint for hero section
  app.get('/api/stats', async (req, res) => {
    try {
      const products = await storage.getCourses();
      const subscribers = await storage.getNewsletterSubscribers();
      
      res.json({
        customers: 10000, // This could be calculated from users
        products: products.length,
        brands: 50, // This could be calculated from unique brands
        subscribers: subscribers.length
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  });

  // Checkout endpoint for email functionality
  app.post('/api/checkout', async (req, res) => {
    try {
      const { customer, items, totals, orderDate } = req.body;
      
      // Generate order ID
      const orderId = `STH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Create email content
      const emailContent = generateOrderEmail(orderId, customer, items, totals, orderDate);
      
      // In a real application, you would send this email using a service like SendGrid, Nodemailer, etc.
      // For demo purposes, we'll log the email content and send it to the specified email
      console.log('📧 ORDER EMAIL CONTENT:');
      console.log('To: mdsorathiya56@gmail.com');
      console.log('Subject: StyleHub Order Confirmation - ' + orderId);
      console.log('Content:');
      console.log(emailContent);
      
      // Simulate email sending
      await simulateEmailSend(emailContent, customer, orderId);
      
      res.status(201).json({ 
        success: true, 
        orderId: orderId,
        message: 'Order placed successfully. Confirmation email sent to mdsorathiya56@gmail.com'
      });
    } catch (error) {
      console.error('Checkout error:', error);
      res.status(500).json({ error: 'Failed to process order' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
