import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:px-6 lg:px-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>
      <DotLottieReact
        src="https://lottie.host/321a22d5-99c6-4931-a6eb-c4c3ef2368b1/SqRO5AeppF.lottie"
        loop
        autoplay
      />
    </div>
  );
};

export default PageNotFound;
