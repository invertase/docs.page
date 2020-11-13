import { Header } from '../components/Header';

export default function IndexPage() {
  function toggle() {
    window.document.body.classList.toggle("dark");
  }

  return (
    <>
      <Header />
      <div className="m-12 w-64 h-64 bg-gray-200 text-black dark:bg-gray-900 dark:text-white">
        <button onClick={() => toggle()}>Toggle Dark Mode &raquo;</button>
      </div>
    </>
  );
}
