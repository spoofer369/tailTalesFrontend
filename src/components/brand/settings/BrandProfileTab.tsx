import { useState, useEffect } from "react";
import {
  Save,
  Globe,
  Instagram,
  Youtube,
  Plus,
  Trash2,
  MapPin,
  Phone,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store";
import { updateBrand } from "@/store/slices/brandDashboardSlice";
import { useToast } from "@/hooks/useToast";
import type { IStoreLocation } from "@/interface";

const emptyLocation: IStoreLocation = {
  name: "",
  address: "",
  city: "",
  state: "",
  phone: "",
};

export default function BrandProfileTab() {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { brand, isSaving } = useAppSelector((s) => s.brandDashboard);

  // ── Profile form state ──
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [youtube, setYoutube] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [foundingYear, setFoundingYear] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [brandStory, setBrandStory] = useState("");

  // ── Location form state ──
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [locationFormData, setLocationFormData] = useState<IStoreLocation>({
    ...emptyLocation,
  });
  const [locationErrors, setLocationErrors] = useState<Record<string, string>>(
    {},
  );

  const locations: IStoreLocation[] =
    brand?.brand_details?.store_locations || [];

  // ── Populate form from brand data ──
  useEffect(() => {
    if (!brand) return;
    setName(brand.name || "");
    setDescription(brand.description || "");
    setWebsiteUrl(brand.website_url || "");
    setEmail(brand.contact_info?.email || "");
    setPhone(brand.contact_info?.phone || "");
    setAddress(brand.contact_info?.address || "");
    setInstagram(brand.social_media?.instagram || "");
    setTwitter(brand.social_media?.twitter || "");
    setFacebook(brand.social_media?.facebook || "");
    setLinkedin(brand.social_media?.linkedin || "");
    setYoutube(brand.social_media?.youtube || "");
    setWhatsapp(brand.social_media?.whatsapp || "");
    setFoundingYear(
      brand.brand_details?.founding_year
        ? String(brand.brand_details.founding_year)
        : "",
    );
    setHeadquarters(brand.brand_details?.headquarters || "");
    setBrandStory(brand.brand_details?.brand_story || "");
  }, [brand]);

  // ── Save profile ──
  const handleSaveProfile = async () => {
    if (!brand) return;
    try {
      await dispatch(
        updateBrand({
          id: brand.id,
          data: {
            name: name.trim(),
            description: description.trim(),
            website_url: websiteUrl.trim(),
            contact_info: {
              email: email.trim(),
              phone: phone.trim(),
              address: address.trim(),
            },
            social_media: {
              instagram: instagram.trim(),
              twitter: twitter.trim(),
              facebook: facebook.trim(),
              linkedin: linkedin.trim(),
              tiktok: brand.social_media?.tiktok || "",
              youtube: youtube.trim(),
              whatsapp: whatsapp.trim(),
            },
            brand_details: {
              ...brand.brand_details,
              founding_year: foundingYear
                ? parseInt(foundingYear, 10)
                : null,
              headquarters: headquarters.trim(),
              brand_story: brandStory.trim(),
            },
          },
        }),
      ).unwrap();
      showToast({ type: "success", title: "Brand profile updated" });
    } catch (error) {
      showToast({
        type: "error",
        title: "Failed to update profile",
        subtitle: typeof error === "string" ? error : "Please try again",
      });
    }
  };

  // ── Location helpers ──
  const saveLocations = async (updatedLocations: IStoreLocation[]) => {
    if (!brand) return false;
    try {
      await dispatch(
        updateBrand({
          id: brand.id,
          data: {
            brand_details: {
              ...brand.brand_details,
              store_locations: updatedLocations,
            },
          },
        }),
      ).unwrap();
      return true;
    } catch (error) {
      showToast({
        type: "error",
        title: "Failed to save locations",
        subtitle: typeof error === "string" ? error : "Please try again",
      });
      return false;
    }
  };

  const validateLocation = (): boolean => {
    const errs: Record<string, string> = {};
    if (!locationFormData.name.trim()) errs.name = "Name is required";
    if (!locationFormData.address.trim()) errs.address = "Address is required";
    if (!locationFormData.city.trim()) errs.city = "City is required";
    setLocationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddLocation = async () => {
    if (!validateLocation()) return;
    const updated = [...locations, { ...locationFormData }];
    const success = await saveLocations(updated);
    if (success) {
      showToast({ type: "success", title: "Location added successfully" });
      setLocationFormData({ ...emptyLocation });
      setShowLocationForm(false);
    }
  };

  const handleDeleteLocation = async (index: number) => {
    const updated = locations.filter((_, i) => i !== index);
    const success = await saveLocations(updated);
    if (success) {
      showToast({ type: "success", title: "Location removed" });
    }
  };

  if (!brand) {
    return (
      <div className="py-12 text-center text-sm text-gray-500">
        Loading brand data…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── PROFILE SECTION ─── */}

      {/* Basic Info */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Brand Name
              </Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Website URL
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="pl-9"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Description
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe your brand…"
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@brand.com"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Phone
              </Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Address
            </Label>
            <Textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              placeholder="Full address…"
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            Social Media
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Instagram className="w-4 h-4" /> Instagram
              </Label>
              <Input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/brand"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Twitter / X
              </Label>
              <Input
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://x.com/brand"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </Label>
              <Input
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/brand"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </Label>
              <Input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/company/brand"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Youtube className="w-4 h-4" /> YouTube
              </Label>
              <Input
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://youtube.com/@brand"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </Label>
              <Input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+91 9876543210"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brand Story */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            Brand Story
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Founding Year
              </Label>
              <Input
                type="number"
                value={foundingYear}
                onChange={(e) => setFoundingYear(e.target.value)}
                placeholder="2020"
                min={1900}
                max={new Date().getFullYear()}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Headquarters
              </Label>
              <Input
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
                placeholder="City, Country"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Brand Story
            </Label>
            <Textarea
              value={brandStory}
              onChange={(e) => setBrandStory(e.target.value)}
              rows={4}
              placeholder="Tell the story of your brand…"
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Profile Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="bg-violet-600 hover:bg-violet-700 cursor-pointer"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving…" : "Save Changes"}
        </Button>
      </div>

      {/* ─── STORE LOCATIONS SECTION ─── */}

      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Store Locations ({locations.length})
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage your physical store locations
            </p>
          </div>
          <Button
            onClick={() => setShowLocationForm(!showLocationForm)}
            className="bg-violet-600 hover:bg-violet-700 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </Button>
        </div>

        {/* Add Location Form */}
        {showLocationForm && (
          <Card className="border-violet-200 bg-violet-50/30 mb-4">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">
                New Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Location Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={locationFormData.name}
                    onChange={(e) =>
                      setLocationFormData((p) => ({
                        ...p,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Main Store"
                  />
                  {locationErrors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {locationErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Phone
                  </Label>
                  <Input
                    value={locationFormData.phone}
                    onChange={(e) =>
                      setLocationFormData((p) => ({
                        ...p,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="+91 9876543210"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={locationFormData.address}
                    onChange={(e) =>
                      setLocationFormData((p) => ({
                        ...p,
                        address: e.target.value,
                      }))
                    }
                    placeholder="Full street address"
                  />
                  {locationErrors.address && (
                    <p className="text-xs text-red-500 mt-1">
                      {locationErrors.address}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={locationFormData.city}
                    onChange={(e) =>
                      setLocationFormData((p) => ({
                        ...p,
                        city: e.target.value,
                      }))
                    }
                    placeholder="Mumbai"
                  />
                  {locationErrors.city && (
                    <p className="text-xs text-red-500 mt-1">
                      {locationErrors.city}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    State
                  </Label>
                  <Input
                    value={locationFormData.state}
                    onChange={(e) =>
                      setLocationFormData((p) => ({
                        ...p,
                        state: e.target.value,
                      }))
                    }
                    placeholder="Maharashtra"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowLocationForm(false);
                    setLocationFormData({ ...emptyLocation });
                    setLocationErrors({});
                  }}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddLocation}
                  disabled={isSaving}
                  className="bg-violet-600 hover:bg-violet-700 cursor-pointer"
                >
                  {isSaving ? "Saving…" : "Add Location"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location Cards */}
        {locations.length === 0 && !showLocationForm ? (
          <Card>
            <CardContent className="py-16 text-center">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-medium text-gray-900 mb-1">
                No locations added
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Add your store locations so customers can find you
              </p>
              <Button
                onClick={() => setShowLocationForm(true)}
                className="bg-violet-600 hover:bg-violet-700 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Location
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {locations.map((loc, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {loc.name || "Unnamed Location"}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {[loc.address, loc.city, loc.state]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      {loc.phone && (
                        <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {loc.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteLocation(i)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove location"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
