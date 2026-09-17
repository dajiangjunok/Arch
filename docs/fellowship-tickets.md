# Fellowship 周数与付款配置

Fellowship 可选 Week 1、Week 2、Week 3 中任意一周、任意两周（包含 Week 1 + Week 3），或全部三周。通过审核后，管理员生成 Stripe 付款链接。

| 周数 | 总价（USD） | Stripe Price 环境变量 | 动态金额环境变量（美分） |
| --- | --- | --- | --- |
| 1 | $1,500 | `STRIPE_PRICE_FELLOWSHIP_SINGLE_WEEK` | `ARCH_TICKET_AMOUNT_FELLOWSHIP_SINGLE_WEEK=150000` |
| 2 | $2,400 | `STRIPE_PRICE_FELLOWSHIP_TWO_WEEKS` | `ARCH_TICKET_AMOUNT_FELLOWSHIP_TWO_WEEKS=240000` |
| 3 | $3,000 | `STRIPE_PRICE_FELLOWSHIP_FULL_PROGRAM` | `ARCH_TICKET_AMOUNT_FELLOWSHIP_FULL_PROGRAM=300000` |

上线前先执行 `supabase/migrations/018_fellowship_week_options.sql`，再部署代码。

在 Stripe 中创建对应金额、USD 币种的一次性 Price，将 `price_...` 填入部署环境的三个 `STRIPE_PRICE_FELLOWSHIP_*` 变量。每个 Price 是整个套餐的总价，结账数量固定为 1。测试和正式环境使用各自的 Price ID。

变量占位和动态金额已列在 `.env.example`。沿用现有付款配置逻辑：优先使用 Stripe Price ID；未填写时，使用对应 `ARCH_TICKET_AMOUNT_*` 动态创建价格，并使用 `ARCH_PAYMENT_CURRENCY=usd`。仍需配置现有的 Stripe 密钥及 webhook。

新票种 ID 为 `fellowship_single_week`、`fellowship_two_weeks`、`fellowship_full_program`。已有 `fellowship` 免费资助申请保留原条件，不转换为收费票。旧的 `/apply?pass=fellowship` 链接会默认打开新的单周 Fellowship 报名。

原有 $1,299 分销优惠仅适用于 Single Week Access，Fellowship 不适用；普通邀请码仍可使用。
