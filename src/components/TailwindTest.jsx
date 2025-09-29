import React from "react";

const TailwindTest = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">
          🎨 TailwindCSS Test Page
        </h1>

        {/* Test Colors */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-primary h-20 rounded-lg flex items-center justify-center text-white font-semibold">
            Primary
          </div>
          <div className="bg-primary-dark h-20 rounded-lg flex items-center justify-center text-white font-semibold">
            Primary Dark
          </div>
          <div className="bg-secondary h-20 rounded-lg flex items-center justify-center text-white font-semibold">
            Secondary
          </div>
          <div className="bg-success h-20 rounded-lg flex items-center justify-center text-white font-semibold">
            Success
          </div>
          <div className="bg-error h-20 rounded-lg flex items-center justify-center text-white font-semibold">
            Error
          </div>
        </div>

        {/* Test Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button className="btn-primary">Primary Button</button>
          <button className="btn-secondary">Secondary Button</button>
          <button className="btn-outline">Outline Button</button>
        </div>

        {/* Test Card */}
        <div className="card mb-8">
          <h3 className="text-xl font-semibold mb-4">Card Component Test</h3>
          <p className="text-gray-600 mb-4">
            This is testing the custom card component with TailwindCSS.
          </p>
          <div className="flex gap-4">
            <span className="badge-success">Success Badge</span>
            <span className="badge-error">Error Badge</span>
            <span className="badge-warning">Warning Badge</span>
          </div>
        </div>

        {/* Test Form */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Form Elements Test</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="test@example.com"
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="checkbox" id="agree" />
              <label htmlFor="agree" className="text-sm">
                I agree to the terms
              </label>
            </div>
            <button className="btn-primary">Submit Form</button>
          </div>
        </div>

        {/* Test Animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card animate-fade-in">
            <h4 className="font-semibold">Fade In</h4>
            <p className="text-sm text-gray-600">Animation test</p>
          </div>
          <div className="card animate-slide-up">
            <h4 className="font-semibold">Slide Up</h4>
            <p className="text-sm text-gray-600">Animation test</p>
          </div>
          <div className="card animate-bounce-subtle">
            <h4 className="font-semibold">Bounce Subtle</h4>
            <p className="text-sm text-gray-600">Animation test</p>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 bg-success text-white px-6 py-3 rounded-lg">
            <span>✅</span>
            <span className="font-semibold">TailwindCSS đang hoạt động!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailwindTest;
