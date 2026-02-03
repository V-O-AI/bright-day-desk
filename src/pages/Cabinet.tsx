import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar, Phone, Mail, MapPin, Plus, CreditCard, Settings, BookOpen, PlayCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Cabinet = () => {
  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-auto pb-6">
        
        {/* Левая колонка - Account details */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card rounded-2xl p-6 border border-border opacity-0 animate-fade-in-up" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
            <h2 className="text-lg font-semibold mb-6">Account details</h2>
            
            {/* Profile photo */}
            <div className="mb-6">
              <Label className="text-sm text-muted-foreground mb-2 block">Profile photo</Label>
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-lg">AK</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Upload new photo</span>
                  <span className="text-xs text-muted-foreground">PNG,JPG max size of 5MB</span>
                  <button className="text-xs text-destructive hover:underline text-left mt-1">Remove</button>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="mb-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Name</Label>
              <Input 
                placeholder="Arina" 
                defaultValue="Arina"
                className="bg-muted/50 border-border"
              />
            </div>

            {/* Surname */}
            <div className="mb-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Surname</Label>
              <Input 
                placeholder="Karnet" 
                defaultValue="Karnet"
                className="bg-muted/50 border-border"
              />
            </div>

            {/* Date of Birth */}
            <div className="mb-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Date of Birth:</Label>
              <div className="relative">
                <Input 
                  placeholder="07/10/1989" 
                  defaultValue="07/10/1989"
                  className="bg-muted/50 border-border pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Phone */}
            <div className="mb-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Phone</Label>
              <div className="relative">
                <Input 
                  placeholder="+1 (555) 123-4567" 
                  defaultValue="+1 (555) 123-4567"
                  className="bg-muted/50 border-border"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Email</Label>
              <Input 
                type="email"
                placeholder="arina.karnet@example.com" 
                defaultValue="arina.karnet@example.com"
                className="bg-muted/50 border-border"
              />
            </div>

            {/* Place of Residence */}
            <div className="mb-6">
              <Label className="text-sm text-muted-foreground mb-2 block">Place of Residence:</Label>
              <Input 
                placeholder="Stenford st., New York, USA" 
                defaultValue="Stenford st., New York, USA"
                className="bg-muted/50 border-border"
              />
            </div>

            {/* Buttons */}
            <Button className="w-full mb-3 bg-primary hover:bg-primary/90">
              Save changes
            </Button>
            <Button variant="outline" className="w-full">
              Cancel changes
            </Button>
          </div>
        </div>

        {/* Центральная колонка - Courses & Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Available courses */}
          <div className="bg-card rounded-2xl p-6 border border-border opacity-0 animate-fade-in-up" style={{ animationDelay: "50ms", animationFillMode: "forwards" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Available courses</h3>
              <button className="text-sm text-primary hover:underline">View all</button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { title: "Speaking Deutch course for begginer", level: "Begginer A2", progress: 25, color: "bg-primary" },
                { title: "Industrial English for medium level", level: "Intermediate B2", progress: 53, color: "bg-primary" },
                { title: "Speaking French course for begginer", level: "Begginer A1", progress: 36, color: "bg-primary" },
              ].map((course, index) => (
                <div key={index} className="bg-muted/30 rounded-xl p-3 hover:shadow-md transition-shadow">
                  <div className="h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg mb-3 flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-primary/60" />
                  </div>
                  <h4 className="text-xs font-medium mb-1 line-clamp-2">{course.title}</h4>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>{course.level}</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${course.color} rounded-full transition-all`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-2xl p-6 border border-border flex items-center gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Courses started</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border flex items-center gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "150ms", animationFillMode: "forwards" }}>
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <PlayCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Lessons completed</p>
                <p className="text-2xl font-bold">435</p>
              </div>
            </div>
          </div>

          {/* Cards section */}
          <div className="bg-card rounded-2xl p-6 border border-border opacity-0 animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Cards</h3>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Settings className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            
            {/* Credit card visual */}
            <div className="relative w-full max-w-[280px] h-[160px] bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 rounded-2xl p-5 mb-4 shadow-lg">
              <div className="absolute top-5 left-5">
                <div className="w-10 h-7 bg-yellow-300/80 rounded-md" />
              </div>
              <div className="absolute bottom-16 left-5 text-white/90 text-sm tracking-[0.2em] font-mono">
                5632 5432 6733 6844
              </div>
              <div className="absolute bottom-5 left-5 text-white text-sm">
                Arina Karnet
              </div>
              <div className="absolute bottom-5 right-5">
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/80" />
                  <div className="w-8 h-8 rounded-full bg-orange-400/80" />
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add new card
            </Button>
          </div>
        </div>

        {/* Правая колонка - Plan & Transactions */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Plan */}
          <div className="bg-card rounded-2xl p-6 border border-border opacity-0 animate-fade-in-up" style={{ animationDelay: "250ms", animationFillMode: "forwards" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Plan</h3>
              <button className="text-sm text-primary hover:underline">See all plans</button>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold text-lg mb-2">Professional</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Full feature set including a personal tutor and unlimited access to materials
              </p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold">$89.99</span>
                <span className="text-muted-foreground">/ year</span>
              </div>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90">
              Extend the subscription
            </Button>
          </div>

          {/* Last transaction */}
          <div className="bg-card rounded-2xl p-6 border border-border opacity-0 animate-fade-in-up" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Last transaction</h3>
              <button className="text-sm text-primary hover:underline">View all</button>
            </div>
            
            <div className="space-y-4">
              {[
                { initials: "PT", title: 'Trial 14 days "Professional"', amount: "- $0,00", color: "text-destructive", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
                { initials: "PTC", title: 'Cancel trial "Professional"', amount: "+ $0,00", color: "text-primary", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
              ].map((transaction, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${transaction.bgColor} flex items-center justify-center`}>
                    <span className="text-sm font-bold text-primary">{transaction.initials}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{transaction.title}</p>
                    <p className={`text-sm ${transaction.color}`}>{transaction.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Cabinet;
