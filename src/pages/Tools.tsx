import { useState } from 'react';
import { RecipeGenerator } from '@/components/food/RecipeGenerator';
import { NutritionChatbot } from '@/components/food/NutritionChatbot';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export const Tools = () => {
  const [activeTab, setActiveTab] = useState<'recipes' | 'chat'>('recipes');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 my-4">
          {/* New Heading Section */}
          <div className="max-w-3xl mx-auto mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-3">
                 Nutrition Tools
            </h1>
            <p className="text-muted-foreground">
                Explore our comprehensive suite of nutrition tools to help you make informed food choices
            </p>
          </div>

          <div className="bg-card rounded-xl overflow-hidden border border-border/40 shadow-subtle">
            {/* Tab Navigation */}
            <div className="flex border-b border-border/60">
              <button
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'recipes' 
                    ? 'bg-primary/5 text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
                onClick={() => setActiveTab('recipes')}
              >
                Recipe Generator
              </button>
              <button
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'chat' 
                    ? 'bg-primary/5 text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
                onClick={() => setActiveTab('chat')}
              >
                Nutrition Chat
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'recipes' ? (
                <RecipeGenerator />
              ) : (
                <NutritionChatbot />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};