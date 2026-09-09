# 分销商固定优惠码

单周套餐原价 **$9,799 USD**，授权分销商的专属优惠码固定减 **$1,299**，应付 **$8,500**。一个申请只能有一个邀请码或优惠码；优惠码同时确定分销归属。普通邀请码继续用于原价推荐。

两周、三周和 Fellowship 不适用这项优惠。优惠码可重复分享，每份申请减一次。申请提交后，套餐、归属和优惠价格锁定；本版本不支持给已提交申请补码。管理员关闭“优惠”只影响新申请，不会取消已保存的价格。分销商自身的停用及佣金处理继续遵循原有规则。

## 分销商如何决定是否优惠

管理员开启的是优惠码使用权限，不会自动给该分销商的所有客户降价。分销商在 `/partner` 的 **Choose what to share** 区域选择分享方式，普通邀请卡片始终排在优惠邀请前面：

| 分享方式 | 页面按钮 | 单周应付金额 |
| --- | --- | --- |
| 普通邀请 | **Copy full-price link · $9,799** 或 **Copy invite code** | $9,799 |
| 谈价后给予优惠 | **Copy discount link · $8,500** 或 **Copy discount code** | $8,500 |

客户可以通过对应链接进入申请页自动带入并校验，或者手动输入码后点击 **Apply**。优惠码同时包含分销归属，无需再填普通邀请码。每个分销商使用一个可重复分享的优惠码，由分销商决定是否发给客户。

## 上线顺序

1. 在已经应用 `001`–`016` 的 Supabase 数据库执行 `supabase/migrations/017_distributor_discount_codes.sql`。可以将整个文件复制到 Supabase SQL Editor 一次执行。此迁移增加字段与函数，不修改历史价格；所有分销商的优惠权限默认关闭。迁移保留普通邀请码的旧接口，支持先迁移后部署。
2. 在对应 Stripe 测试环境创建下面的 Coupon，配置服务端环境变量，部署代码到测试环境并完成验收。
3. 正式环境分别创建 Coupon、配置环境变量、更新 webhook 后部署。测试和正式 Coupon ID、密钥、webhook secret 必须使用各自环境的值。
4. 在后台顶部点击 **Discount codes**（`/admin/referrals#discount-codes`），在页面顶部的独立优惠码区域找到目标分销商，点击 **Enable $1,299 discount**。系统会先检查 Stripe 配置，再生成该分销商唯一的优惠码。分销商必须处于 active 状态。
5. 分销商进入 `/partner`，复制优惠链接或优惠码。普通邀请链接与优惠链接分别显示。关闭再开启优惠会使用同一个优惠码。

## Stripe 后台配置

在 [Coupons 管理页](https://dashboard.stripe.com/coupons) 创建一个 Coupon：

| 配置 | 值 |
| --- | --- |
| Name | `Distributor Discount` |
| Discount type | Amount off / 固定金额 |
| Amount | `1299` |
| Currency | USD |
| Duration（如果出现） | Once；此项影响订阅，本应用是一次性付款 |
| Redemption limit | 不设置总使用次数限制 |
| Expiration / Redeem by | 不设置到期时间 |
| Product restrictions | 推荐不设置；适用套餐由应用服务端限制 |

复制创建后的 **Coupon ID**，配置新增的服务端环境变量：

```dotenv
STRIPE_COUPON_DISTRIBUTOR_1299=你的Coupon_ID
```

所有分销商共用这个 Stripe Coupon；各自的客户优惠码在本站管理，不需要在 Stripe 为每个分销商创建 Promotion Code，也不需要让客户在 Stripe 重新输入优惠码。通过 API 创建时，`amount_off` 是 `129900` 美分。

继续使用现有 `STRIPE_PRICE_SINGLE_WEEK`，其价格必须为 **USD 9,799 的有效一次性价格**。如果只使用动态金额配置，则需要：

```dotenv
ARCH_PAYMENT_CURRENCY=usd
ARCH_TICKET_AMOUNT_SINGLE_WEEK=979900
```

动态金额模式下 Coupon 不应限定 Product，因为每次结账会创建商品。若使用固定 Stripe Price，可以将 Coupon 限定到这个 Price 对应的 Product。

创建 Checkout 时，服务端传入原价和保存的 Coupon ID，并核对 Stripe 返回的原价、优惠、币种和最终总额。任何不一致都会阻止提供付款链接；不会默默恢复原价。优惠订单关闭 Adaptive Pricing，保持 USD 8,500。已经提交的申请保留当时的 Coupon ID；不要删除这些申请仍需使用的 Coupon。若配置变动导致无法兑现已保存的报价，恢复匹配的 Stripe 配置后重试生成付款链接。

## Webhook

在现有 `/api/stripe/webhook` destination 增加订阅：

```text
checkout.session.async_payment_succeeded
```

其余事件参见 [stripe-refunds.md](stripe-refunds.md)。即使 `checkout.session.completed` 已发生，只有 `payment_status=paid` 才记录到账并产生佣金。延迟付款通过 `async_payment_succeeded` 确认。

付款事件校验对应的 Checkout Session 和保存的优惠金额。重复事件不会重复计佣，退款后到达的旧付款事件不会覆盖退款状态。订单创建会复用申请的未完成订单，Stripe 请求带有幂等键；处理中的付款不会生成另一个可支付链接。失败的延迟付款只有在旧 PaymentIntent 已取消后才生成替代链接。若使用受限 Stripe API key，需要 Coupons/Prices 读取权限、Checkout Sessions 读写权限，以及 PaymentIntents 读取和取消权限。

## 佣金和退款

保留默认 1 / 3 / 5 / 10 个有效付费推荐对应的 9% / 15% / 20% / 30%（实际使用后台档位配置），并保留升级后追溯补差。折扣订单计入付费推荐数。

普通码与优惠码绑定同一个分销商，付费推荐数和佣金按分销商合并计算，每笔订单只计一次。例如一笔 $9,799 普通订单加一笔 $8,500 优惠订单，在默认 9% 档位下累计佣金为 $1,646.91；再增加一笔 $9,799 普通订单后达到 3 笔，按默认 15% 重算累计佣金为 $4,214.70，并补记差额。

实付 $8,500 时，各档对应 $765 / $1,275 / $1,700 / $2,550。计算基数继续使用实付金额减去已退款金额，不扣 Stripe 手续费。全额退款会移除相应有效付费推荐，并按现有规则重算档位及佣金。

## 验证

```bash
npm test
npm run typecheck
npm run build
```

数据库测试在独立的内存 PostgreSQL（PGlite）上执行全部迁移，不连接线上数据库。Stripe 测试替换 SDK 网络方法，验证价格参数、配置校验、幂等键及付款重试行为，不调用真实支付服务。

上线前在 Stripe 测试环境完成一次人工验收：

1. 未授权分销商只能分享普通邀请码；启用优惠后出现独立的普通邀请和优惠邀请卡片。分别复制链接或码，确认普通邀请仍为单周 $9,799，优惠邀请为 $8,500。
2. 手动输入并 Apply，以及从优惠链接进入，都显示 $9,799 − $1,299 = $8,500。
3. 删除优惠码、修改码或切换两周/三周/Fellowship，旧优惠不得继续显示或使用。
4. 输入无效或已停用的码，申请应被阻止并提示。提交前关闭优惠权限也应被服务端拒绝。
5. 成功提交后再关闭优惠，申请和付款链接仍保留 $8,500。
6. 审核通过，Stripe 显示优惠明细和 USD 8,500，测试付款后核对客户账户、后台订单和分销佣金。
7. 对测试订单部分/全部退款，再重放支付成功事件，核对佣金及退款状态保持正确。

参考：[Stripe Checkout 折扣](https://docs.stripe.com/payments/checkout/discounts)、[创建 Coupon](https://docs.stripe.com/api/coupons/create)、[到账确认与重复回调](https://docs.stripe.com/checkout/fulfillment)。
