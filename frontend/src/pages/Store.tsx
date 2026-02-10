import { useState } from "react";
import { Coffee, MessageCircle, Minus, Plus, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/mode-toggle";
import UserMenu from "@/components/layout/user-menu";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import ChatBox from "@/components/chats/chat-box";

interface CoffeeProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const COFFEE_PRODUCTS: CoffeeProduct[] = [
  {
    id: "espresso",
    name: "Espresso",
    description: "Rich and bold single shot of pure coffee essence.",
    price: 3.5,
    image: "☕",
  },
  {
    id: "americano",
    name: "Americano",
    description: "Espresso diluted with hot water for a smooth, full-bodied taste.",
    price: 4.0,
    image: "☕",
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    description: "Equal parts espresso, steamed milk, and velvety foam.",
    price: 5.0,
    image: "☕",
  },
  {
    id: "latte",
    name: "Caffè Latte",
    description: "Smooth espresso with steamed milk and a light layer of foam.",
    price: 5.5,
    image: "☕",
  },
  {
    id: "mocha",
    name: "Mocha",
    description: "Espresso blended with chocolate and steamed milk, topped with cream.",
    price: 6.0,
    image: "☕",
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    description: "Slow-steeped for 12 hours, smooth and refreshing over ice.",
    price: 5.0,
    image: "🧊",
  },
  {
    id: "matcha-latte",
    name: "Matcha Latte",
    description: "Premium Japanese matcha whisked with steamed milk.",
    price: 6.0,
    image: "🍵",
  },
  {
    id: "affogato",
    name: "Affogato",
    description: "A scoop of vanilla gelato drowned in a shot of hot espresso.",
    price: 6.5,
    image: "🍨",
  },
];

export function Store() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isChatOpen, setIsChatOpen] = useState(false);

  const getQuantity = (id: string) => quantities[id] || 0;

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0);
  const totalPrice = Object.entries(quantities).reduce((sum, [id, qty]) => {
    const product = COFFEE_PRODUCTS.find((p) => p.id === id);
    return sum + (product?.price || 0) * qty;
  }, 0);

  const handlePurchase = () => {
    if (totalItems === 0) {
      toast.error("Please add at least one item to your order.");
      return;
    }

    const orderItems = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const product = COFFEE_PRODUCTS.find((p) => p.id === id);
        return `${qty}x ${product?.name}`;
      })
      .join(", ");

    toast.success(`Order placed! ${orderItems}. Total: $${totalPrice.toFixed(2)}`);
    setQuantities({});
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* HEADER */}
      <div className="w-full p-4 md:p-8 flex justify-between bg-muted">
        <div className="flex gap-2 items-center justify-center">
          <Coffee className="text-primary" />
          <h1 className="text-2xl font-bold text-primary">Version Coffee</h1>
        </div>
        <div className="flex items-center gap-2">
          <UserMenu />
          <ModeToggle />
        </div>
      </div>

      {/* STORE CONTENT */}
      <div className="relative flex-1 overflow-auto p-4 md:p-8 pb-32">
        {/* CHATBOT TOGGLE BUTTON */}
        <Button
          onClick={() => setIsChatOpen((prev) => !prev)}
          className="sticky top-0 ml-auto z-50 shadow-lg float-right flex gap-2"
        >
          <MessageCircle className="h-5 w-5" />
          Order via Chatbot
        </Button>

        <div className="mx-auto">
          <h2 className="text-xl font-semibold mb-1">Our Menu</h2>
          <p className="text-muted-foreground mb-6">
            Select your favorites below, or use the chatbot to place your order.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {COFFEE_PRODUCTS.map((product) => {
              const qty = getQuantity(product.id);
              return (
                <Card
                  key={product.id}
                  className={`transition-all ${qty > 0 ? "ring-2 ring-primary" : ""}`}
                >
                  <CardContent className="flex flex-col gap-3 p-5">
                    <div className="text-4xl text-center">{product.image}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-muted-foreground leading-snug mt-1">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-bold text-primary text-lg">
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(product.id, -1)}
                          disabled={qty === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-6 text-center font-medium">{qty}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(product.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* PURCHASE BAR */}
      <div className="bg-muted p-4 md:px-8 z-40">
        <div className="mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
          </div>
          <Button
            onClick={handlePurchase}
            disabled={totalItems === 0}
            className="px-8"
          >
            Purchase
          </Button>
        </div>
      </div>



      {/* CHATBOX */}
      {isChatOpen && <ChatBox onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}

export default Store;
