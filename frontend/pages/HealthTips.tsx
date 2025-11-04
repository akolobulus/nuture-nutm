import { useState, useMemo } from "react";
import { Lightbulb, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { mockHealthTips } from "../lib/mockData";

export default function HealthTips() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Get unique categories from mock data
  const categories = useMemo(() => {
    const cats = Array.from(new Set(mockHealthTips.map(tip => tip.category)));
    return cats.sort();
  }, []);

  // Filter tips based on category
  const filteredTips = useMemo(() => {
    if (categoryFilter === "all") return mockHealthTips;
    return mockHealthTips.filter(tip => tip.category === categoryFilter);
  }, [categoryFilter]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Health Tips</h1>
              <p className="text-muted-foreground">
                Expert advice for staying healthy during your studies
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredTips.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTips.map((tip) => (
                <Card key={tip.id} className="hover:border-[#00A859]/50 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Lightbulb className="w-5 h-5 text-[#00A859] flex-shrink-0 mt-1" />
                      <Badge variant="outline" className="text-xs">
                        {tip.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tip.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Lightbulb className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No Tips Found</h3>
                <p className="text-muted-foreground">
                  {categoryFilter === "all"
                    ? "No health tips available yet"
                    : `No tips found in ${categoryFilter}`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
