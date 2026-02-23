export const WELCOME_EMAIL_TEMPLATE = `<td bgcolor="#f7eded" align="center" class="esd-stripe" style="background-color:#f7eded">
<table esd-img-prev-src width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-content-body" style="background-color:rgb(255, 255, 255)">
  <tbody>
    <tr>
      <td bgcolor="transparent" align="left" class="esd-structure es-p40t es-p20r es-p20l" style="background-color:transparent">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td width="560" valign="top" align="center" class="esd-container-frame">
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td align="center" class="esd-block-image es-p5t es-p5b" style="font-size:0">
                        <a target="_blank">
                          <img src="https://tlr.stripocdn.email/content/guids/CABINET_dd354a98a803b60e2f0411e893c82f56/images/23891556799905703.png" alt="TaskBoard Logo" width="175" style="display:block">
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" class="esd-block-text es-p15t es-p15b">
                        <h1 style="color:#703030;font-size:24px;margin:0">
                          <strong>WELCOME TO TASKBOARD!</strong>
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" class="esd-block-text es-p40r es-p40l">
                        <p style="text-align:center;color:#703030;font-size:16px">
                          Hi {{name}},
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" class="esd-block-text es-p35r es-p40l">
                        <p style="text-align:center;color:#703030">
                          Your account has been successfully created with email: <strong>{{email}}</strong>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" class="esd-block-text es-p25t es-p40r es-p40l">
                        <p style="color:#703030;line-height:1.6">
                          Welcome to TaskBoard! Start organizing your tasks and boost your productivity. We're excited to have you on board!
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" class="esd-block-button es-p40t es-p40b es-p10r es-p10l">
                        <span class="es-button-border" style="border-color:#703030;background-color:#703030;border-radius:6px">
                          <a href="{{loginUrl}}" target="_blank" class="es-button" style="background-color:#703030;color:#f7eded;border-color:#703030;font-weight:bold;text-decoration:none;padding:15px 30px;border-radius:6px;display:inline-block;font-size:16px">
                            GET STARTED
                          </a>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td align="left" class="esd-structure es-p20t es-p10r es-p10l" style="background-color:#f4ebeb">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td width="580" align="center" class="esd-container-frame">
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td align="center" class="esd-block-text es-p15t">
                        <p style="font-size:16px;color:#703030;margin:0">
                          <strong>Follow us:</strong>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" class="esd-block-social es-p10t es-p20b" style="font-size:0">
                        <table cellspacing="0" cellpadding="0" class="es-table-not-adapt es-social">
                          <tbody>
                            <tr>
                              <td valign="top" align="center" class="es-p10r">
                                <a target="_blank" href="{{facebookUrl}}">
                                  <img src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/facebook-rounded-gray.png" alt="Facebook" title="Facebook" width="32">
                                </a>
                              </td>
                              <td valign="top" align="center" class="es-p10r">
                                <a target="_blank" href="{{twitterUrl}}">
                                  <img src="https://localfiles.stripocdn.email/content/assets/img/social-icons/rounded-gray/x-rounded-gray.png" alt="X" title="X" width="32">
                                </a>
                              </td>
                              <td valign="top" align="center" class="es-p10r">
                                <a target="_blank" href="{{instagramUrl}}">
                                  <img src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/instagram-rounded-gray.png" alt="Instagram" title="Instagram" width="32">
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td align="left" class="esd-structure es-p5t es-p20b es-p20r es-p20l" style="background-color:#e4d4d4">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td width="560" valign="top" align="center" class="esd-container-frame">
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td align="center" class="esd-block-text">
                        <p style="font-size:14px;color:#703030">
                          Contact us: <a target="_blank" href="tel:{{phone}}" style="font-size:14px;color:#703030">{{phone}}</a> | <a target="_blank" href="mailto:{{supportEmail}}" style="font-size:14px;color:#703030">{{supportEmail}}</a>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
</td>`;

export const EMAIL_VERIFY_TEMPLATE = `<td bgcolor="#f7eded" align="center" class="esd-stripe" style="background-color:#f7eded">
<table esd-img-prev-src width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-content-body" style="background-color:rgb(255, 255, 255)">
  <tbody>
    <tr>
      <td bgcolor="transparent" align="left" class="esd-structure es-p40t es-p20r es-p20l" style="background-color:transparent">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td width="560" valign="top" align="center" class="esd-container-frame">
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td align="center" class="esd-block-image es-p5t es-p5b" style="font-size:0">
                        <a target="_blank">
                          <img src="https://tlr.stripocdn.email/content/guids/CABINET_dd354a98a803b60e2f0411e893c82f56/images/23891556799905703.png" alt="TaskBoard Logo" width="175" style="display:block">
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" class="esd-block-text es-p15t es-p15b">
                        <h1 style="color:#703030;font-size:24px;margin:0">
                          <strong>VERIFY YOUR EMAIL</strong>
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" class="esd-block-text es-p40r es-p40l">
                        <p style="text-align:center;color:#703030;font-size:16px">
                          Hi {{name}},
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" class="esd-block-text es-p35r es-p40l">
                        <p style="text-align:center;color:#703030">
                          Please verify your email address to complete your account setup.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" class="esd-block-text es-p25t es-p40r es-p40l">
                        <p style="color:#703030;line-height:1.6">
                          Your verification code is:
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" class="esd-block-text es-p20t es-p20b">
                        <div style="background-color:#f4ebeb;border:2px dashed #703030;border-radius:8px;padding:20px;margin:20px 0">
                          <h2 style="color:#703030;font-size:32px;margin:0;letter-spacing:5px;font-family:monospace">
                            {{otp}}
                          </h2>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" class="esd-block-text es-p40r es-p40l">
                        <p style="color:#703030;line-height:1.6;font-size:14px">
                          This code will expire in 24 hours. If you didn't request this verification, please ignore this email.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td align="left" class="esd-structure es-p5t es-p20b es-p20r es-p20l" style="background-color:#e4d4d4">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td width="560" valign="top" align="center" class="esd-container-frame">
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td align="center" class="esd-block-text">
                        <p style="font-size:14px;color:#703030">
                          Contact us: <a target="_blank" href="tel:{{phone}}" style="font-size:14px;color:#703030">{{phone}}</a> | <a target="_blank" href="mailto:{{supportEmail}}" style="font-size:14px;color:#703030">{{supportEmail}}</a>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
</td>`;

export const PASSWORD_RESET_TEMPLATE = `<td bgcolor="#f7eded" align="center" class="esd-stripe" style="background-color:#f7eded">
<table esd-img-prev-src width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-content-body" style="background-color:rgb(255, 255, 255)">
  <tbody>
    <tr>
      <td bgcolor="transparent" align="left" class="esd-structure es-p40t es-p20r es-p20l" style="background-color:transparent">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td width="560" valign="top" align="center" class="esd-container-frame">
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td align="center" class="esd-block-image es-p5t es-p5b" style="font-size:0">
                        <a target="_blank">
                          <img src="https://tlr.stripocdn.email/content/guids/CABINET_dd354a98a803b60e2f0411e893c82f56/images/23891556799905703.png" alt="TaskBoard Logo" width="175" style="display:block">
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" class="esd-block-text es-p15t es-p15b">
                        <h1 style="color:#703030;font-size:24px;margin:0">
                          <strong>RESET YOUR PASSWORD</strong>
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" class="esd-block-text es-p40r es-p40l">
                        <p style="text-align:center;color:#703030;font-size:16px">
                          Hi {{name}},
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" class="esd-block-text es-p35r es-p40l">
                        <p style="text-align:center;color:#703030">
                          We received a request to reset your password for your TaskBoard account.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" class="esd-block-text es-p25t es-p40r es-p40l">
                        <p style="color:#703030;line-height:1.6">
                          Use this code to reset your password:
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" class="esd-block-text es-p20t es-p20b">
                        <div style="background-color:#f4ebeb;border:2px dashed #703030;border-radius:8px;padding:20px;margin:20px 0">
                          <h2 style="color:#703030;font-size:32px;margin:0;letter-spacing:5px;font-family:monospace">
                            {{otp}}
                          </h2>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" class="esd-block-button es-p20t es-p40b es-p10r es-p10l">
                        <span class="es-button-border" style="border-color:#703030;background-color:#703030;border-radius:6px">
                          <a href="{{resetUrl}}" target="_blank" class="es-button" style="background-color:#703030;color:#f7eded;border-color:#703030;font-weight:bold;text-decoration:none;padding:15px 30px;border-radius:6px;display:inline-block;font-size:16px">
                            RESET PASSWORD
                          </a>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" class="esd-block-text es-p40r es-p40l">
                        <p style="color:#703030;line-height:1.6;font-size:14px">
                          This code will expire in 15 minutes. If you didn't request this reset, please ignore this email and your password will remain unchanged.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td align="left" class="esd-structure es-p5t es-p20b es-p20r es-p20l" style="background-color:#e4d4d4">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td width="560" valign="top" align="center" class="esd-container-frame">
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td align="center" class="esd-block-text">
                        <p style="font-size:14px;color:#703030">
                          Contact us: <a target="_blank" href="tel:{{phone}}" style="font-size:14px;color:#703030">{{phone}}</a> | <a target="_blank" href="mailto:{{supportEmail}}" style="font-size:14px;color:#703030">{{supportEmail}}</a>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
</td>`;
export const ORDER_CONFIRMATION_TEMPLATE = `<td bgcolor="#f7eded" align="center" class="esd-stripe" style="background-color:#f7eded">
<table esd-img-prev-src width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-content-body" style="background-color:rgb(255, 255, 255)">
  <tbody>
    <tr>
      <td bgcolor="transparent" align="left" class="esd-structure es-p40t es-p20r es-p20l" style="background-color:transparent">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td width="560" valign="top" align="center" class="esd-container-frame">
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td align="center" class="esd-block-image es-p5t es-p5b" style="font-size:0">
                        <a target="_blank">
                          <img src="https://tlr.stripocdn.email/content/guids/CABINET_dd354a98a803b60e2f0411e893c82f56/images/23891556799905703.png" alt="Logo" width="175" style="display:block">
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" class="esd-block-text es-p15t es-p15b">
                        <h1 style="color:#703030;font-size:24px;margin:0">
                          <strong>ORDER CONFIRMATION</strong>
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" class="esd-block-text es-p40r es-p40l">
                        <p style="text-align:center;color:#703030;font-size:16px">
                          Hi {{firstName}} {{lastName}},
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" class="esd-block-text es-p35r es-p40l">
                        <p style="text-align:center;color:#703030">
                          Thank you for your order! Your order has been received and is being processed.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" class="esd-block-text es-p20t es-p20b">
                        <div style="background-color:#f4ebeb;border:2px solid #703030;border-radius:8px;padding:20px;margin:20px 40px">
                          <p style="color:#703030;margin:0;font-size:14px">Order Number</p>
                          <h2 style="color:#703030;font-size:24px;margin:10px 0;font-family:monospace">
                            {{orderNumber}}
                          </h2>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" class="esd-block-text es-p20r es-p20l">
                        <h3 style="color:#703030;font-size:18px;margin-bottom:15px">Order Details:</h3>
                        <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
                          <thead>
                            <tr style="background-color:#f4ebeb">
                              <th style="padding:10px;text-align:left;color:#703030;border-bottom:2px solid #703030">Product</th>
                              <th style="padding:10px;text-align:center;color:#703030;border-bottom:2px solid #703030">Qty</th>
                              <th style="padding:10px;text-align:right;color:#703030;border-bottom:2px solid #703030">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {{orderItems}}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" class="esd-block-text es-p20t es-p20r es-p20l">
                        <table width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding:8px 0;color:#703030">Subtotal:</td>
                            <td style="padding:8px 0;text-align:right;color:#703030;font-weight:bold">{{subtotal}} MAD</td>
                          </tr>
                          <tr>
                            <td style="padding:8px 0;color:#703030">Shipping:</td>
                            <td style="padding:8px 0;text-align:right;color:#703030;font-weight:bold">{{shipping}} MAD</td>
                          </tr>
                          <tr style="border-top:2px solid #703030">
                            <td style="padding:12px 0;color:#703030;font-size:18px;font-weight:bold">Total:</td>
                            <td style="padding:12px 0;text-align:right;color:#703030;font-size:18px;font-weight:bold">{{total}} MAD</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" class="esd-block-text es-p20t es-p20r es-p20l">
                        <h3 style="color:#703030;font-size:18px;margin-bottom:10px">Contact Information:</h3>
                        <p style="color:#703030;margin:5px 0">
                          <strong>Email:</strong> {{email}}<br>
                          <strong>Phone:</strong> {{phone}}
                        </p>
                      </td>
                    </tr>
                    {{#if orderNotes}}
                    <tr>
                      <td align="left" class="esd-block-text es-p20t es-p20r es-p20l">
                        <h3 style="color:#703030;font-size:18px;margin-bottom:10px">Order Notes:</h3>
                        <p style="color:#703030;background-color:#f4ebeb;padding:15px;border-radius:6px">
                          {{orderNotes}}
                        </p>
                      </td>
                    </tr>
                    {{/if}}
                    <tr>
                      <td align="center" class="esd-block-text es-p25t es-p40r es-p40l es-p40b">
                        <p style="color:#703030;line-height:1.6;font-size:14px">
                          We'll send you another email once your order has been shipped. If you have any questions, please don't hesitate to contact us.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td align="left" class="esd-structure es-p20t es-p10r es-p10l" style="background-color:#f4ebeb">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td width="580" align="center" class="esd-container-frame">
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td align="center" class="esd-block-text es-p15t">
                        <p style="font-size:16px;color:#703030;margin:0">
                          <strong>Follow us:</strong>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" class="esd-block-social es-p10t es-p20b" style="font-size:0">
                        <table cellspacing="0" cellpadding="0" class="es-table-not-adapt es-social">
                          <tbody>
                            <tr>
                              <td valign="top" align="center" class="es-p10r">
                                <a target="_blank" href="{{facebookUrl}}">
                                  <img src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/facebook-rounded-gray.png" alt="Facebook" title="Facebook" width="32">
                                </a>
                              </td>
                              <td valign="top" align="center" class="es-p10r">
                                <a target="_blank" href="{{twitterUrl}}">
                                  <img src="https://localfiles.stripocdn.email/content/assets/img/social-icons/rounded-gray/x-rounded-gray.png" alt="X" title="X" width="32">
                                </a>
                              </td>
                              <td valign="top" align="center" class="es-p10r">
                                <a target="_blank" href="{{instagramUrl}}">
                                  <img src="https://tlr.stripocdn.email/content/assets/img/social-icons/rounded-gray/instagram-rounded-gray.png" alt="Instagram" title="Instagram" width="32">
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td align="left" class="esd-structure es-p5t es-p20b es-p20r es-p20l" style="background-color:#e4d4d4">
        <table width="100%" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td width="560" valign="top" align="center" class="esd-container-frame">
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td align="center" class="esd-block-text">
                        <p style="font-size:14px;color:#703030">
                          Contact us: <a target="_blank" href="tel:{{phone}}" style="font-size:14px;color:#703030">{{supportPhone}}</a> | <a target="_blank" href="mailto:{{supportEmail}}" style="font-size:14px;color:#703030">{{supportEmail}}</a>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
</td>`;
