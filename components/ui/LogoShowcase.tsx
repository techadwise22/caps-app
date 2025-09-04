'use client';

import Logo from './Logo';

export default function LogoShowcase() {
  return (
    <div className="bg-white rounded-xl shadow-soft p-8">
      <h2 className="text-2xl font-bold text-surface-900 mb-6">CAPS @ 25 Logo Variations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Size Variations */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-surface-700">Size Variations</h3>
          <div className="space-y-3">
            <Logo size="sm" showText={true} />
            <Logo size="md" showText={true} />
            <Logo size="lg" showText={true} />
            <Logo size="xl" showText={true} />
          </div>
        </div>

        {/* Animation Variations */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-surface-700">Animation Effects</h3>
          <div className="space-y-3">
            <Logo size="md" showText={false} animation="spin" />
            <Logo size="md" showText={false} animation="pulse" />
            <Logo size="md" showText={false} animation="bounce" />
            <Logo size="md" showText={false} animation="glow" />
          </div>
        </div>

        {/* Text Variations */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-surface-700">Text Options</h3>
          <div className="space-y-3">
            <Logo size="md" showText={true} />
            <Logo size="md" showText={false} />
            <Logo size="lg" showText={true} />
            <Logo size="lg" showText={false} />
          </div>
        </div>

        {/* Interactive Examples */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-surface-700">Interactive Examples</h3>
          <div className="space-y-3">
            <Logo size="md" showText={true} animated={true} />
            <Logo size="md" showText={true} animated={false} />
            <div className="p-4 bg-surface-50 rounded-lg">
              <Logo size="sm" showText={true} animation="pulse" />
            </div>
          </div>
        </div>

        {/* Logo Only */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-surface-700">Logo Only</h3>
          <div className="space-y-3">
            <Logo size="sm" showText={false} />
            <Logo size="md" showText={false} />
            <Logo size="lg" showText={false} />
            <Logo size="xl" showText={false} />
          </div>
        </div>

        {/* Special Effects */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-surface-700">Special Effects</h3>
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <Logo size="md" showText={true} animation="glow" />
            </div>
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
              <Logo size="md" showText={true} animation="bounce" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Logo Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p><strong>Primary Colors:</strong></p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Dark Blue: #1e3a8a (Primary)</li>
              <li>Gold: #FFD700 (Border)</li>
              <li>White: #FFFFFF (Text & Icons)</li>
            </ul>
          </div>
          <div>
            <p><strong>Available Sizes:</strong></p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Small: 24x24px</li>
              <li>Medium: 32x32px</li>
              <li>Large: 48x48px</li>
              <li>Extra Large: 64x64px</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 