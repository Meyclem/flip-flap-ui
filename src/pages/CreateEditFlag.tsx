import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { flagSchema, FlagFormData } from "@/lib/validation";
import { flagsApi, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Save, X, ChevronLeft } from "lucide-react";
import { EnvironmentConfig as EnvironmentConfigComponent } from "@/components/EnvironmentConfig";

export default function CreateEditFlag() {
  const { flagKey } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(flagKey);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FlagFormData>({
    resolver: zodResolver(flagSchema),
    defaultValues: {
      flagKey: "",
      name: "",
      description: "",
      environments: {
        development: { enabled: false },
        staging: { enabled: false },
        production: { enabled: false },
      },
    },
  });

  useEffect(() => {
    if (isEdit && flagKey) {
      loadFlag(flagKey);
    }
  }, [flagKey, isEdit]);

  const loadFlag = async (key: string) => {
    try {
      setInitialLoading(true);
      const flag = await flagsApi.get(key);
      setValue("flagKey", flag.flagKey);
      setValue("name", flag.name);
      setValue("description", flag.description || "");
      setValue("environments", flag.environments);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.problem.title);
      } else {
        toast.error("Failed to load flag");
      }
      navigate("/");
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: FlagFormData) => {
    try {
      setLoading(true);
      
      const payload = {
        flagKey: data.flagKey,
        name: data.name,
        description: data.description,
        environments: {
          development: data.environments.development,
          staging: data.environments.staging,
          production: data.environments.production,
        },
      } as const;
      
      if (isEdit && flagKey) {
        await flagsApi.update(flagKey, payload as any);
        toast.success("Flag updated successfully");
      } else {
        await flagsApi.create(payload as any);
        toast.success("Flag created successfully");
      }
      navigate("/");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.problem.title, {
          description: Array.isArray(error.problem.detail)
            ? error.problem.detail.join(", ")
            : error.problem.detail,
        });
      } else {
        toast.error(isEdit ? "Failed to update flag" : "Failed to create flag");
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading flag...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Flags
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            {isEdit ? "Edit Flag" : "Create New Flag"}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="environments">Environment Configuration</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Configure the basic details of your feature flag
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="flagKey">Flag Key *</Label>
                    <Input
                      id="flagKey"
                      className="font-mono"
                      placeholder="my-feature-flag"
                      disabled={isEdit}
                      {...register("flagKey")}
                    />
                    {errors.flagKey && (
                      <p className="text-sm text-destructive">{errors.flagKey.message}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Lowercase letters, numbers, hyphens, and underscores only
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="My Feature Flag"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this flag controls..."
                      rows={4}
                      {...register("description")}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive">{errors.description.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="environments" className="space-y-6">
              <EnvironmentConfigComponent
                environment="development"
                config={(watch("environments.development") as any) || { enabled: false }}
                allEnvironments={watch("environments") as any}
                onChange={(config) => setValue("environments.development", config as any)}
              />

              <EnvironmentConfigComponent
                environment="staging"
                config={(watch("environments.staging") as any) || { enabled: false }}
                allEnvironments={watch("environments") as any}
                onChange={(config) => setValue("environments.staging", config as any)}
              />

              <EnvironmentConfigComponent
                environment="production"
                config={(watch("environments.production") as any) || { enabled: false }}
                allEnvironments={watch("environments") as any}
                onChange={(config) => setValue("environments.production", config as any)}
              />
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 mt-8">
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : isEdit ? "Update Flag" : "Create Flag"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/")}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
