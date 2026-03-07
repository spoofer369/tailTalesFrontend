import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  IBrand,
  IBrandInfoForm,
  IContactForm,
  IAddressForm,
  CreateBrandPayload,
} from "@/interfaces";
import { createBrandApi } from "@/services/brandService";

// ── State ──
interface BrandRegistrationState {
  currentStep: 1 | 2 | 3;
  brandInfo: IBrandInfoForm;
  contact: IContactForm;
  address: IAddressForm;
  isSubmitting: boolean;
  error: string | null;
  createdBrand: IBrand | null;
}

const initialState: BrandRegistrationState = {
  currentStep: 1,
  brandInfo: {
    name: "",
    description: "",
    logo: "",
  },
  contact: {
    contactPerson: "",
    phone: "",
    email: "",
    website: "",
    instagram: "",
    whatsapp: "",
  },
  address: {
    address: "",
    city: "",
    pinCode: "",
  },
  isSubmitting: false,
  error: null,
  createdBrand: null,
};

// ── Helpers ──

// Ensure a string is a valid URL (starts with http:// or https://), or return empty string
function toValidUrl(value: string): string {
  if (!value || value.trim() === "") return "";
  const trimmed = value.trim();
  if (/^https?:\/\/.+/.test(trimmed)) return trimmed;
  // If it looks like a domain (contains a dot), prepend https://
  if (trimmed.includes(".")) return `https://${trimmed}`;
  return "";
}

// Convert Instagram handle to URL, or return empty string
function toInstagramUrl(value: string): string {
  if (!value || value.trim() === "") return "";
  const trimmed = value.trim();
  if (/^https?:\/\//.test(trimmed)) return trimmed;
  // Strip @ prefix and build URL
  const handle = trimmed.replace(/^@/, "");
  if (handle) return `https://instagram.com/${handle}`;
  return "";
}

function buildPayload(state: BrandRegistrationState): CreateBrandPayload {
  const { brandInfo, contact, address } = state;

  // Format phone with country code
  const formattedPhone = contact.phone
    ? (contact.phone.startsWith("+") ? contact.phone : `+91${contact.phone}`)
    : "";

  return {
    name: brandInfo.name,
    description: brandInfo.description || undefined,
    // Only send logo if it's a real URL, not a base64 data URI (too large for JSON body)
    logo: brandInfo.logo && !brandInfo.logo.startsWith("data:") ? brandInfo.logo : undefined,
    website_url: toValidUrl(contact.website) || undefined,
    social_media: {
      instagram: toInstagramUrl(contact.instagram),
      whatsapp: contact.whatsapp || "",
    },
    contact_info: {
      email: contact.email || "",
      phone: formattedPhone,
      address: [address.address, address.city, address.pinCode]
        .filter(Boolean)
        .join(", "),
    },
    brand_details: {
      headquarters: address.city || "",
    },
  };
}

// ── Async Thunks ──

export const createBrand = createAsyncThunk<
  IBrand,
  void,
  {
    rejectValue: string;
    state: {
      brandRegistration: BrandRegistrationState;
      auth: { user: { id: number } | null };
    };
  }
>("brand/create", async (_, { rejectWithValue, getState }) => {
  try {
    const { brandRegistration, auth } = getState();
    const payload = buildPayload(brandRegistration);

    // Include user_id so backend can link brand to user
    const payloadWithUser = {
      ...payload,
      user_id: auth.user?.id,
    };

    const response = await createBrandApi(
      payloadWithUser as CreateBrandPayload & { user_id?: number },
    );
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to register brand",
    );
  }
});

// ── Slice ──

const brandRegistrationSlice = createSlice({
  name: "brandRegistration",
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<1 | 2 | 3>) {
      state.currentStep = action.payload;
    },
    nextStep(state) {
      if (state.currentStep < 3) {
        state.currentStep = (state.currentStep + 1) as 1 | 2 | 3;
      }
    },
    prevStep(state) {
      if (state.currentStep > 1) {
        state.currentStep = (state.currentStep - 1) as 1 | 2 | 3;
      }
    },
    updateBrandInfo(state, action: PayloadAction<Partial<IBrandInfoForm>>) {
      state.brandInfo = { ...state.brandInfo, ...action.payload };
    },
    updateContact(state, action: PayloadAction<Partial<IContactForm>>) {
      state.contact = { ...state.contact, ...action.payload };
    },
    updateAddress(state, action: PayloadAction<Partial<IAddressForm>>) {
      state.address = { ...state.address, ...action.payload };
    },
    clearBrandError(state) {
      state.error = null;
    },
    resetBrandRegistration() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBrand.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.createdBrand = action.payload;
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || "Failed to register brand";
      });
  },
});

export const {
  setStep,
  nextStep,
  prevStep,
  updateBrandInfo,
  updateContact,
  updateAddress,
  clearBrandError,
  resetBrandRegistration,
} = brandRegistrationSlice.actions;

export default brandRegistrationSlice.reducer;
