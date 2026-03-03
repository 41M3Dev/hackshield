import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Zap,
  Lock,
  Globe,
  ChevronRight,
  Check,
  BarChart3,
  Terminal,
  FileText,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useThemeStore } from '../store/themeStore';

const features = [
  {
    icon: <Zap className="w-6 h-6 text-primary-400" />,
    title: 'Automated Pentesting',
    desc: 'Run comprehensive security scans with zero manual effort. Our engine covers OWASP Top 10 and beyond.',
  },
  {
    icon: <Lock className="w-6 h-6 text-green-400" />,
    title: 'Real-time Detection',
    desc: 'Identify vulnerabilities the moment they appear. Instant alerts for critical security issues.',
  },
  {
    icon: <Globe className="w-6 h-6 text-purple-400" />,
    title: 'Multi-target Support',
    desc: 'Scan web apps, APIs, and network infrastructure from a single unified dashboard.',
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-amber-400" />,
    title: 'Detailed Reporting',
    desc: 'Professional PDF reports with executive summaries and developer-friendly remediation steps.',
  },
  {
    icon: <Terminal className="w-6 h-6 text-red-400" />,
    title: 'API First',
    desc: 'Integrate HackShield into your CI/CD pipeline with our developer-friendly REST API.',
  },
  {
    icon: <FileText className="w-6 h-6 text-cyan-400" />,
    title: 'Compliance Ready',
    desc: 'Generate compliance reports for SOC 2, ISO 27001, PCI DSS, and GDPR frameworks.',
  },
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    desc: 'Perfect for individuals and small projects',
    features: ['2 targets', '5 scans/month', 'Basic vulnerability reports', 'Community support'],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Starter',
    price: '$49',
    period: '/month',
    desc: 'For growing teams that need more power',
    features: ['10 targets', '50 scans/month', 'Full reports + PDF export', 'Email support', 'API access'],
    cta: 'Start Trial',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$149',
    period: '/month',
    desc: 'For security-focused organizations',
    features: [
      'Unlimited targets',
      'Unlimited scans',
      'Advanced reports + compliance',
      'Priority support',
      'CI/CD integration',
      'Custom scan policies',
    ],
    cta: 'Start Trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large organizations with specific needs',
    features: [
      'Everything in Pro',
      'Dedicated infrastructure',
      'SSO & SAML',
      'SLA guarantee',
      'Dedicated success manager',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
];

const LandingPage: React.FC = () => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Hack<span className="text-primary-400">Shield</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-slate-100 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-slate-100 transition-colors">Pricing</a>
            <a href="#" className="hover:text-slate-100 transition-colors">Docs</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-100" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-primary-400 mb-8">
            <Zap className="w-3 h-3" />
            Automated pentesting, enterprise-grade
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6">
            Find vulnerabilities
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
              before hackers do
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            HackShield automates your security testing. Scan web apps, APIs, and infrastructure
            for critical vulnerabilities — get actionable reports in minutes, not days.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Start Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                View Demo
              </Button>
            </Link>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            No credit card required · Free forever plan available
          </p>
        </div>

        {/* Mock dashboard preview */}
        <div className="relative max-w-5xl mx-auto mt-20">
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 overflow-hidden shadow-2xl shadow-black/50">
            {/* Browser bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <div className="flex-1 mx-4 bg-slate-700/50 rounded px-3 py-1 text-xs text-slate-500 font-mono">
                app.hackshield.io/dashboard
              </div>
            </div>
            {/* Dashboard mock */}
            <div className="p-6 grid grid-cols-4 gap-4">
              {[
                { label: 'Total Scans', value: '247', color: 'text-primary-400' },
                { label: 'Active Targets', value: '18', color: 'text-green-400' },
                { label: 'Critical Vulns', value: '4', color: 'text-red-400' },
                { label: 'Success Rate', value: '94%', color: 'text-amber-400' },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/40">
                  <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
              <div className="col-span-4 bg-slate-800/60 rounded-xl p-4 border border-slate-700/40">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-400">Recent Scans</p>
                  <span className="text-xs text-primary-400">View all →</span>
                </div>
                <div className="space-y-2">
                  {['api.example.com', 'app.startup.io', 'dashboard.corp.com'].map((host) => (
                    <div key={host} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                      <span className="text-xs font-mono text-slate-300">{host}</span>
                      <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-medium">FINISHED</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 border-t border-slate-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Everything you need to stay secure</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Professional-grade security testing tools, automated and accessible to teams of all sizes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-slate-100 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 border-t border-slate-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400">Start free. Scale as you grow. No surprises.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-6 border transition-all duration-200 relative ${
                  plan.highlight
                    ? 'bg-primary-500/10 border-primary-500/40 shadow-lg shadow-primary-500/10'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-slate-100">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{plan.desc}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-black text-slate-100">{plan.price}</span>
                  <span className="text-slate-400 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button
                    variant={plan.highlight ? 'primary' : 'outline'}
                    className={`w-full ${!plan.highlight ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : ''}`}
                    size="sm"
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 border-t border-slate-800/60">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">
            Ready to secure your infrastructure?
          </h2>
          <p className="text-slate-400 mb-8">
            Join thousands of security teams that trust HackShield to protect their applications.
          </p>
          <Link to="/register">
            <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary-500" />
            <span>© 2024 HackShield. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
