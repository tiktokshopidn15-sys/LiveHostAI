import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ExternalLink, Loader2 } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductShowcaseProps {
  products: Product[];
  onUpdateProduct: (id: number, url: string) => void;
  loadingProducts: Set<number>;
}

export function ProductShowcase({ products, onUpdateProduct, loadingProducts }: ProductShowcaseProps) {
  const [urls, setUrls] = useState<Record<number, string>>({});

  const handleUrlChange = (id: number, url: string) => {
    setUrls((prev) => ({ ...prev, [id]: url }));
  };

  const handleUpdate = (id: number) => {
    const url = urls[id];
    if (url && url.trim()) {
      onUpdateProduct(id, url.trim());
      setUrls((prev) => ({ ...prev, [id]: "" }));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Product Showcase</h3>
        <p className="text-sm text-muted-foreground">
          Add up to 10 product links. AI will promote them during idle time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 10 }).map((_, index) => {
          const productId = index + 1;
          const product = products.find((p) => p.id === productId);
          const isLoading = loadingProducts.has(productId);
          
          return (
            <Card key={productId} data-testid={`product-slot-${productId}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0 rounded-full">
                    {productId}
                  </Badge>
                  <CardTitle className="text-sm">
                    Product {productId}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {!product ? (
                  <div className="space-y-2">
                    <Input
                      placeholder="Paste product URL"
                      value={urls[productId] || ""}
                      onChange={(e) => handleUrlChange(productId, e.target.value)}
                      className="h-9 text-sm"
                      data-testid={`input-product-url-${productId}`}
                      disabled={isLoading}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleUpdate(productId)}
                      disabled={!urls[productId]?.trim() || isLoading}
                      className="w-full"
                      data-testid={`button-add-product-${productId}`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3 h-3 mr-2" />
                          Add Product
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-3">
                      {product.image && (
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name || "Product"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="font-medium text-sm line-clamp-2">
                          {product.name || "Product"}
                        </p>
                        {product.price && (
                          <p className="font-bold text-primary">
                            {product.price}
                          </p>
                        )}
                        {product.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                      data-testid={`button-view-product-${productId}`}
                    >
                      <a href={product.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-2" />
                        View Product
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
