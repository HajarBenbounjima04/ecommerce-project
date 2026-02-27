import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import transporter from "../config/nodemailer.js";
import { ORDER_CONFIRMATION_TEMPLATE } from "../config/emailTemplate.js";

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, orderNotes } = req.body;
    const userId = req.user._id;

    // Validation
    if (!firstName || !lastName || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "All billing details are required",
      });
    }

    // Get user's cart
    const cart = await cartModel
      .findOne({ userId })
      .populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Prepare order items
    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      quantity: item.quantity,
      price: item.priceAtAdd,
      selectedSize: item.selectedSize || undefined, // ✅ undefined au lieu de null
      selectedMaterial: item.selectedMaterial || undefined, // ✅ undefined au lieu de null
      selectedCharacteristics: item.selectedCharacteristics || undefined,
    }));

    // Calculate totals
    const subtotal = cart.subtotal;
    const shippingCost = 0; // You can add shipping calculation logic here
    const total = subtotal + shippingCost;

    // Create order
    const order = await orderModel.create({
      userId,
      firstName,
      lastName,
      phone,
      email,
      items: orderItems,
      subtotal,
      shippingCost,
      total,
      orderNotes: orderNotes || "",
    });

    // Send confirmation email
    try {
      // Build order items HTML
      const orderItemsHtml = orderItems
        .map(
          (item) => `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #e4d4d4;color:#703030">
            ${item.name}
            ${
              item.selectedSize
                ? `<br><span style="font-size:12px">${item.selectedSize.value}${item.selectedSize.unit}</span>`
                : ""
            }
            ${
              item.selectedMaterial
                ? `<br><span style="font-size:12px">${item.selectedMaterial.name}</span>`
                : ""
            }
          </td>
          <td style="padding:10px;border-bottom:1px solid #e4d4d4;text-align:center;color:#703030">${
            item.quantity
          }</td>
          <td style="padding:10px;border-bottom:1px solid #e4d4d4;text-align:right;color:#703030">${(
            item.price * item.quantity
          ).toFixed(2)} MAD</td>
        </tr>
      `
        )
        .join("");

      // Replace template variables
      let emailHtml = ORDER_CONFIRMATION_TEMPLATE.replace(
        /{{firstName}}/g,
        firstName
      )
        .replace(/{{lastName}}/g, lastName)
        .replace(/{{orderNumber}}/g, order.orderNumber)
        .replace(/{{orderItems}}/g, orderItemsHtml)
        .replace(/{{subtotal}}/g, subtotal.toFixed(2))
        .replace(/{{shipping}}/g, shippingCost.toFixed(2))
        .replace(/{{total}}/g, total.toFixed(2))
        .replace(/{{email}}/g, email)
        .replace(/{{phone}}/g, phone)
        .replace(
          /{{supportPhone}}/g,
          process.env.SUPPORT_PHONE || "+212 XXX XXX XXX"
        )
        .replace(
          /{{supportEmail}}/g,
          process.env.SUPPORT_EMAIL || "support@yourstore.com"
        )
        .replace(/{{facebookUrl}}/g, process.env.FACEBOOK_URL || "#")
        .replace(/{{twitterUrl}}/g, process.env.TWITTER_URL || "#")
        .replace(/{{instagramUrl}}/g, process.env.INSTAGRAM_URL || "#");

      // Handle order notes (conditional)
      if (orderNotes) {
        emailHtml = emailHtml
          .replace(/{{#if orderNotes}}/g, "")
          .replace(/{{\/if}}/g, "")
          .replace(/{{orderNotes}}/g, orderNotes);
      } else {
        emailHtml = emailHtml.replace(
          /{{#if orderNotes}}[\s\S]*?{{\/if}}/g,
          ""
        );
      }

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: `Order Confirmation - ${order.orderNumber}`,
        html: emailHtml,
      };

      await transporter.sendMail(mailOptions);
      console.log("Order confirmation email sent to:", email);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Don't fail the order if email fails
    }

    // Clear cart after successful order
    cart.items = [];
    cart.subtotal = 0;
    cart.total = 0;
    cart.itemCount = 0;
    await cart.save();

    res.json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await orderModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .populate("items.productId");

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await orderModel
      .findOne({ _id: orderId, userId })
      .populate("items.productId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
