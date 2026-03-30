import { Check } from 'lucide-react';
import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  const basePlan = products.find((product) => product.name === 'Base');
  const plusPlan = products.find((product) => product.name === 'Plus');

  const basePrice = prices.find((price) => price.productId === basePlan?.id);
  const plusPrice = prices.find((price) => price.productId === plusPlan?.id);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="main-content">
      <h1 className="text-3xl font-bold text-gray-950 mb-8 text-center">Pricing</h1>
      <p className="mb-8 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-800">
        Billing is temporarily unavailable while we perform maintenance.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <PricingCard
          name={basePlan?.name || 'Base'}
          price={basePrice?.unitAmount || 800}
          interval={basePrice?.interval || 'month'}
          trialDays={basePrice?.trialPeriodDays || 7}
          features={[
            'Unlimited Usage',
            'Unlimited Workspace Members',
            'Email Support',
          ]}
        />
        <PricingCard
          name={plusPlan?.name || 'Plus'}
          price={plusPrice?.unitAmount || 1200}
          interval={plusPrice?.interval || 'month'}
          trialDays={plusPrice?.trialPeriodDays || 7}
          features={[
            'Everything in Base, and:',
            'Early Access to New Features',
            '24/7 Support + Slack Access',
          ]}
        />
      </div>
    </main>
  );
}

function PricingCard({
  name,
  price,
  interval,
  trialDays,
  features
}: {
  name: string;
  price: number;
  interval: string;
  trialDays: number;
  features: string[];
}) {
  return (
    <div className="pt-6 border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
      <h2 className="text-2xl font-bold text-gray-950 mb-2">{name}</h2>
      <p className="text-sm text-gray-700 font-medium mb-4">
        with {trialDays}-day free trial
      </p>
      <p className="text-4xl font-bold text-gray-950 mb-6">
        ${price / 100}{' '}
        <span className="text-xl font-normal text-gray-700">
          per user / {interval}
        </span>
      </p>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span className="text-gray-800">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-gray-300 px-4 text-sm font-medium text-gray-700"
        disabled
        aria-disabled="true"
      >
        Temporarily Unavailable
      </button>
    </div>
  );
}
