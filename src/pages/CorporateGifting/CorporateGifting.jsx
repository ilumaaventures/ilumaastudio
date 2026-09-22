import React, { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  CreditCard,
  Mail,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  addCorporateRecipients,
  createCorporateCampaign,
  createCorporatePayment,
  getCorporateEmployees,
  reviewCorporateCampaign,
  verifyCorporatePayment,
} from "../../api/corporateGiftService";
import { getRazorpayKey, loadRazorpayScript } from "../../api/paymentApi";

const emptyRecipient = {
  employeeId: "",
  employeeName: "",
  email: "",
  phone: "",
};
const fieldClass =
  "w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-[#8f5d3b] focus:ring-2 focus:ring-[#8f5d3b]/15";

export default function CorporateGifting() {
  const { user } = useSelector((state) => state.auth);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    companyName: "",
    campaignTitle: "",
    giftMode: "GIFT_BUDGET",
    budgetPerRecipient: "",
    message: "",
    expiryDate: "",
  });
  const [recipients, setRecipients] = useState([{ ...emptyRecipient }]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    getCorporateEmployees()
      .then(setEmployees)
      .catch(() => {})
      .finally(() => setLoadingEmployees(false));
  }, []);

  const total = useMemo(
    () => Number(form.budgetPerRecipient || 0) * recipients.length,
    [form.budgetPerRecipient, recipients.length],
  );

  const updateForm = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const selectEmployee = (index, employeeId) => {
    const employee = employees.find((item) => item._id === employeeId);
    if (!employee) return;
    const next = [...recipients];
    next[index] = {
      employeeId: employee._id,
      employeeName: employee.user?.name || employee.name || "",
      email: employee.user?.email || employee.email || "",
      phone: employee.user?.phone || employee.phone || "",
    };
    setRecipients(next);
  };

  const updateRecipient = (index, field, value) => {
    setRecipients((current) =>
      current.map((recipient, row) =>
        row === index ? { ...recipient, [field]: value } : recipient,
      ),
    );
  };

  const addRecipient = () =>
    setRecipients((current) => [...current, { ...emptyRecipient }]);
  const removeRecipient = (index) => {
    setRecipients((current) => current.filter((_, row) => row !== index));
  };

  const validate = () => {
    if (!form.companyName.trim() || !form.campaignTitle.trim()) {
      toast.error("Company and campaign title are required.");
      return false;
    }
    if (Number(form.budgetPerRecipient) <= 0) {
      toast.error("Enter a budget greater than zero.");
      return false;
    }
    if (
      !recipients.length ||
      recipients.some(
        (recipient) =>
          !recipient.employeeName || !/^\S+@\S+\.\S+$/.test(recipient.email),
      )
    ) {
      toast.error("Every employee needs a name and valid email.");
      return false;
    }
    return true;
  };

  const startPayment = async (campaign) => {
    const payment = await createCorporatePayment(campaign._id);
    const loaded = await loadRazorpayScript();
    if (!loaded) throw new Error("Payment checkout could not be loaded.");
    const key = await getRazorpayKey();
    const order = payment.order;
    if (!order?.id) {
      throw new Error(
        "Payment order was not created. Check Razorpay configuration and try again.",
      );
    }

    await new Promise((resolve, reject) => {
      const checkout = new window.Razorpay({
        key,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "ILUMAA Corporate Gifting",
        description: form.campaignTitle,
        order_id: order.id,
        prefill: { name: user?.name || "", email: user?.email || "" },
        handler: async (response) => {
          try {
            const verified = await verifyCorporatePayment(campaign._id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verified?.delivery?.failed) {
              toast.error(
                `${verified.delivery.failed} employee email(s) failed. Retry from SuperAdmin Gift Engine.`,
              );
            }
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        modal: { ondismiss: () => reject(new Error("Payment was cancelled.")) },
        theme: { color: "#8f5d3b" },
      });
      checkout.open();
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const campaignResponse = await createCorporateCampaign({
        ...form,
        budgetPerRecipient: Number(form.budgetPerRecipient),
        expectedRecipientCount: recipients.length,
        coordinator: {
          name: user?.name || form.companyName,
          email: user?.email,
          phone: user?.phone || "",
        },
      });
      const campaign = campaignResponse.campaign;
      await addCorporateRecipients(campaign._id, recipients);
      await reviewCorporateCampaign(campaign._id);
      await startPayment(campaign);
      setComplete(true);
      toast.success("Gifts issued and employee emails queued.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Could not create corporate gifts.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (complete) {
    return (
      <main className="min-h-[70vh] bg-stone-50 px-4 py-16">
        <section className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-white p-10 text-center shadow-sm">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
          <h1 className="mt-5 text-3xl font-serif text-stone-900">
            Corporate gifts are on their way
          </h1>
          <p className="mt-3 text-sm text-stone-600">
            Each mapped employee received a secure, single-use gift URL by
            email. SuperAdmin can now track delivery, opening, and redemption.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f5d3b]">
              ILUMAA for business
            </p>
            <h1 className="mt-2 text-4xl font-serif text-stone-900">
              Corporate gifting
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-stone-600">
              Create a funded gift program, map one secure gift to each
              employee, and send every link automatically.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-stone-600 shadow-sm">
            <Users className="h-4 w-4 text-[#8f5d3b]" /> {recipients.length}{" "}
            recipients
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]"
        >
          <section className="space-y-5 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-[#8f5d3b]" />
              <h2 className="font-semibold text-stone-900">Program details</h2>
            </div>
            <input
              name="companyName"
              value={form.companyName}
              onChange={updateForm}
              placeholder="Company name"
              className={fieldClass}
            />
            <input
              name="campaignTitle"
              value={form.campaignTitle}
              onChange={updateForm}
              placeholder="Campaign title, e.g. Diwali 2026"
              className={fieldClass}
            />
            <select
              name="giftMode"
              value={form.giftMode}
              onChange={updateForm}
              className={fieldClass}
            >
              <option value="GIFT_BUDGET">
                Employee chooses within budget
              </option>
              <option value="SPECIFIC_GIFT">Same specific gift</option>
              <option value="BESPOKE_HAMPER">Bespoke hamper</option>
            </select>
            <label className="block text-xs font-semibold text-stone-600">
              Budget per employee
              <input
                name="budgetPerRecipient"
                type="number"
                min="1"
                value={form.budgetPerRecipient}
                onChange={updateForm}
                placeholder="₹ 2,000"
                className={`${fieldClass} mt-2`}
              />
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={updateForm}
              placeholder="Message included in the email"
              rows="4"
              className={`${fieldClass} resize-none`}
            />
            <div className="rounded-2xl bg-stone-50 p-4 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Total to fund</span>
                <strong className="text-stone-900">
                  ₹{total.toLocaleString("en-IN")}
                </strong>
              </div>
              <p className="mt-2 flex items-center gap-2 text-xs text-stone-500">
                <CreditCard className="h-3.5 w-3.5" /> Razorpay checkout creates
                the gifts only after payment verification.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-[#8f5d3b]" />
                <h2 className="font-semibold text-stone-900">Map employees</h2>
              </div>
              <button
                type="button"
                onClick={addRecipient}
                className="inline-flex items-center gap-1 rounded-xl bg-stone-900 px-3 py-2 text-xs font-semibold text-white"
              >
                <Plus className="h-3.5 w-3.5" /> Add employee
              </button>
            </div>
            {loadingEmployees && (
              <p className="mb-3 text-xs text-stone-500">
                Loading eligible employees...
              </p>
            )}
            <div className="space-y-3">
              {recipients.map((recipient, index) => (
                <div
                  key={`${index}-${recipient.employeeId}`}
                  className="grid gap-2 rounded-2xl border border-stone-200 bg-stone-50 p-3 sm:grid-cols-[1fr_1fr_auto]"
                >
                  <select
                    value={recipient.employeeId}
                    onChange={(event) =>
                      selectEmployee(index, event.target.value)
                    }
                    className={`${fieldClass} bg-white`}
                  >
                    <option value="">Select existing employee</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.user?.name || employee.name} ·{" "}
                        {employee.user?.email || employee.email}
                      </option>
                    ))}
                  </select>
                  <input
                    value={recipient.email}
                    onChange={(event) =>
                      updateRecipient(index, "email", event.target.value)
                    }
                    placeholder="Employee email"
                    type="email"
                    className={`${fieldClass} bg-white`}
                  />
                  <button
                    type="button"
                    onClick={() => removeRecipient(index)}
                    disabled={recipients.length === 1}
                    className="self-center rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <input
                    value={recipient.employeeName}
                    onChange={(event) =>
                      updateRecipient(index, "employeeName", event.target.value)
                    }
                    placeholder="Employee name"
                    className={`${fieldClass} bg-white sm:col-span-2`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs text-blue-800">
              <Mail className="h-4 w-4 shrink-0" /> Secure links are single-use
              and remain tied to the mapped email address.
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#8f5d3b] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#744a2f] disabled:cursor-wait disabled:opacity-60"
            >
              {submitting ? "Preparing secure gifts..." : "Review and pay"}
              <CreditCard className="h-4 w-4" />
            </button>
          </section>
        </form>
      </div>
    </main>
  );
}
