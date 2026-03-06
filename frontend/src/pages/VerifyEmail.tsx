function VerifyEmail() {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
          ✅ Check Your Email
        </h2>
        <p className="text-neutral-500 text-sm">
          We've sent you an email to verify your account. Please check your
          inbox and click the verification link.
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;
