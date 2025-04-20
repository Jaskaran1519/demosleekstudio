"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { MeasurementsSkeleton } from "./skeletons";
import { toast } from "sonner";

interface Measurement {
  id: string;
  name: string;
  measurements: {
    chest: number;
    waist: number;
    hips: number;
    shoulder: number;
    sleeve: number;
    inseam: number;
    height: number;
  };
  createdAt: string;
}

const defaultMeasurements = {
  chest: 0,
  waist: 0,
  hips: 0,
  shoulder: 0,
  sleeve: 0,
  inseam: 0,
  height: 0,
};

// Type for measurement keys
type MeasurementKey = keyof typeof defaultMeasurements;

export function UserMeasurements({ userId }: { userId: string }) {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMeasurement, setNewMeasurement] = useState({
    name: "",
    measurements: { ...defaultMeasurements },
  });

  useEffect(() => {
    let isMounted = true;
    
    async function fetchMeasurements() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/measurements");
        const data = await response.json();
        if (isMounted) {
          setMeasurements(data);
        }
      } catch (error) {
        console.error("Error fetching measurements:", error);
        toast.error("Failed to load measurements");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchMeasurements();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMeasurement),
      });
      
      if (!response.ok) {
        throw new Error("Failed to add measurement");
      }
      
      toast.success("Measurement added successfully");
      
      // Refetch measurements
      const updatedResponse = await fetch("/api/measurements");
      const updatedData = await updatedResponse.json();
      setMeasurements(updatedData);
      
      // Reset form and close dialog
      setIsOpen(false);
      setNewMeasurement({
        name: "",
        measurements: { ...defaultMeasurements },
      });
    } catch (error) {
      console.error("Error adding measurement:", error);
      toast.error("Failed to add measurement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/measurements?id=${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete measurement");
      }
      
      toast.success("Measurement deleted");
      
      // Update local state
      setMeasurements(measurements.filter(m => m.id !== id));
    } catch (error) {
      console.error("Error deleting measurement:", error);
      toast.error("Failed to delete measurement");
    }
  };

  if (isLoading) {
    return <MeasurementsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Measurements</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Measurement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Measurement</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-500 mb-4">
              Add a new set of measurements for yourself or someone else. All measurements should be in centimeters.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Name</label>
                <Input
                  value={newMeasurement.name}
                  onChange={(e) =>
                    setNewMeasurement({ ...newMeasurement, name: e.target.value })
                  }
                  placeholder="e.g., My Measurements"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(defaultMeasurements).map(([key]) => {
                  const typedKey = key as MeasurementKey;
                  return (
                    <div key={typedKey} className="space-y-2">
                      <label className="block text-sm font-medium">
                        {typedKey.charAt(0).toUpperCase() + typedKey.slice(1)} (cm)
                      </label>
                      <Input
                        type="number"
                        value={newMeasurement.measurements[typedKey]}
                        onChange={(e) =>
                          setNewMeasurement({
                            ...newMeasurement,
                            measurements: {
                              ...newMeasurement.measurements,
                              [typedKey]: parseFloat(e.target.value),
                            },
                          })
                        }
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Measurement"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {measurements.length === 0 ? (
        <div className="p-6 text-center border rounded-lg">
          <p className="text-gray-500">No measurements added yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {measurements.map((measurement) => (
            <div
              key={measurement.id}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{measurement.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(measurement.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(measurement.measurements).map(([key, value]) => {
                  const typedKey = key as MeasurementKey;
                  return (
                    <div key={typedKey} className="text-sm">
                      <span className="font-medium">
                        {typedKey.charAt(0).toUpperCase() + typedKey.slice(1)}:
                      </span>{" "}
                      {value} cm
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500">
                Added on {new Date(measurement.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}