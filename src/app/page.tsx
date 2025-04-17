'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Separator} from '@/components/ui/separator';
import {Icons} from '@/components/icons';
import {useToast} from '@/hooks/use-toast';

const cities = [
  {value: 'buenos-aires', label: 'Buenos Aires'},
  {value: 'new-york', label: 'New York'},
  {value: 'paris', label: 'Paris'},
  {value: 'tokyo', label: 'Tokyo'},
];

export default function Home() {
  const [selectedCity, setSelectedCity] = useState(cities[0].value);
  const {toast} = useToast();

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    toast({
      title: 'City Changed',
      description: `Information updated for ${cities.find((city) => city.value === value)?.label}`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary text-white">
      <header className="bg-primary p-6 shadow-md">
        <h1 className="text-3xl font-bold text-center text-white">Tango City</h1>
        <div className="mt-4 flex justify-center items-center">
          <label htmlFor="city-select" className="mr-2 text-sm font-medium">
            Select City:
          </label>
          <Select value={selectedCity} onValueChange={handleCityChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.value} value={city.value}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="container mx-auto p-6 flex-grow">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-secondary">
            <CardHeader>
              <CardTitle>Milongas</CardTitle>
              <CardDescription>Explore tango venues in {cities.find((city) => city.value === selectedCity)?.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Find local milongas and their schedules.</p>
              <Button variant="outline" className="mt-4">
                View Milongas
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-secondary">
            <CardHeader>
              <CardTitle>Events</CardTitle>
              <CardDescription>Discover tango events happening in {cities.find((city) => city.value === selectedCity)?.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Find local tango events and plan your evening.</p>
              <Button variant="outline" className="mt-4">
                View Events
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-secondary">
            <CardHeader>
              <CardTitle>Lessons</CardTitle>
              <CardDescription>Learn tango with experienced instructors in {cities.find((city) => city.value === selectedCity)?.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Find tango lessons for all skill levels.</p>
              <Button variant="outline" className="mt-4">
                View Lessons
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="bg-primary p-4 text-center text-white">
        <Separator className="bg-accent my-2" />
        <p>&copy; {new Date().getFullYear()} Tango City. All rights reserved.</p>
      </footer>
    </div>
  );
}
