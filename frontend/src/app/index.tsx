import { useEffect, lazy, Suspense } from "react";
import { useLocation, Routes, Route, useNavigate } from "react-router-dom";
import { SWRConfig } from "swr";
import { ToastProvider } from "../utils/toast";
import { AxiosProvider } from "../utils/axios";
import { AuthProvider, RequireAuth } from "../utils/auth";
import { PageLoader } from "../components";
import "./index.css";

const Header = lazy(() => import("../components/Header"));
const Login = lazy(() => import("../pages/login"));
const ForgotPassword = lazy(() => import("../pages/forgot-password"));
const ResetPassword = lazy(() => import("../pages/reset-password"));
const Signup = lazy(() => import("../pages/sign-up"));
const Success = lazy(() => import("../pages/success"));

const Admin = lazy(() => import("../pages/admin"));
const ExistingUsersSection = lazy(() => import("../pages/admin/existing-users"));
const InvitationsSection = lazy(() => import("../pages/admin/invitations"));

const Simulator = lazy(() => import("../pages/simulator"));
const OfferModal = lazy(() => import("../pages/simulator/[offerId]"));
const CreateOffer = lazy(() => import("../pages/simulator/create"));
const CopyOffer = lazy(() => import("../pages/simulator/create/[offerId]"));
const EditOffer = lazy(() => import("../pages/simulator/edit/[offerId]"));

const PriceLists = lazy(() => import("../pages/price-lists"));
const CreatePriceList = lazy(() => import("../pages/price-lists/create"));
const EditPriceList = lazy(() => import("../pages/price-lists/[priceListId]"));

const NotFound = lazy(() => import("../pages/404"));
const Error = lazy(() => import("../pages/error"));

function ScrollToTop() {
  const { search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [search]);

  return null;
}

export default function App() {
  const navigate = useNavigate();

  return <>
    <ScrollToTop />

    <ToastProvider>
      <AxiosProvider>
        <SWRConfig value={{
          shouldRetryOnError: false,
          onError: (error) => {
            if (location.pathname !== "/error") {
              const { message } = error?.response?.data || error;
              navigate("/error", { state: { message } });
            }
          }
        }}>
          <AuthProvider>
            <Header />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/error" element={<Error />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/sign-up/:invite" element={<Signup />} />
                <Route path="/success" element={<Success />} />

                <Route path="/" element={<RequireAuth><main /></RequireAuth>} />

                <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>}>
                  <Route path="" element={<Suspense><ExistingUsersSection /></Suspense>} />
                  <Route path="invitations" element={<Suspense><InvitationsSection /></Suspense>} />
                </Route>

                <Route path="/simulator" element={<RequireAuth><Simulator /></RequireAuth>}>
                  <Route path=":offerId" element={<Suspense><OfferModal /></Suspense>} />
                  <Route path="create" element={<Suspense><CreateOffer /></Suspense>} />
                  <Route path="create/:offerId" element={<Suspense><CopyOffer /></Suspense>} />
                  <Route path="edit/:offerId" element={<Suspense><EditOffer /></Suspense>} />
                </Route>

                <Route path="/price-lists" element={<RequireAuth><PriceLists /></RequireAuth>}>
                  <Route path=":priceListId" element={<Suspense><EditPriceList /></Suspense>} />
                  <Route path="create" element={<Suspense><CreatePriceList /></Suspense>} />
                </Route>
              </Routes>
            </Suspense>
          </AuthProvider>
        </SWRConfig>
      </AxiosProvider>
    </ToastProvider>
  </>;
}