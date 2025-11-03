import { api } from "encore.dev/api";
import db from "../db";
import { secret } from "encore.dev/config";

const emailAPIKey = secret("EmailAPIKey");

interface RenewalReminderResponse {
  sent: number;
  message: string;
}

export const sendRenewalReminders = api<void, RenewalReminderResponse>(
  { method: "POST", path: "/cron/renewal-reminders", expose: false },
  async () => {
    const reminderDays = 7;
    
    const expiringSubscriptions = await db.queryAll<{
      user_id: string;
      user_email: string;
      user_name: string;
      plan_name: string;
      end_date: Date;
      days_until_expiry: number;
    }>`
      SELECT 
        s.user_id,
        u.email as user_email,
        u.full_name as user_name,
        p.name as plan_name,
        s.end_date,
        EXTRACT(DAY FROM (s.end_date - NOW())) as days_until_expiry
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      JOIN insurance_plans p ON s.plan_id = p.id
      WHERE s.status = 'active'
        AND s.auto_renew = FALSE
        AND s.end_date BETWEEN NOW() AND NOW() + INTERVAL '${reminderDays} days'
    `;

    for (const sub of expiringSubscriptions) {
      await sendReminderEmail({
        to: sub.user_email,
        name: sub.user_name,
        planName: sub.plan_name,
        expiryDate: sub.end_date,
        daysLeft: Math.ceil(sub.days_until_expiry),
      });
    }

    return {
      sent: expiringSubscriptions.length,
      message: `Sent ${expiringSubscriptions.length} renewal reminders`,
    };
  }
);

async function sendReminderEmail(params: {
  to: string;
  name: string;
  planName: string;
  expiryDate: Date;
  daysLeft: number;
}) {
  const subject = "Your Nuture Insurance Plan is Expiring Soon";
  const body = `
    Dear ${params.name},

    This is a friendly reminder that your ${params.planName} plan will expire in ${params.daysLeft} day(s) on ${params.expiryDate.toLocaleDateString()}.

    To continue enjoying uninterrupted health coverage, please renew your subscription before it expires.

    You can renew your plan by logging into your dashboard at: https://nuture-student-insurance.com/dashboard

    If you have any questions, please don't hesitate to contact us.

    Stay healthy,
    The Nuture Team
  `;

  console.log(`Sending renewal reminder to ${params.to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
}
