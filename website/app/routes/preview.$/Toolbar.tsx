import {
	Button,
	Dialog,
	DialogPanel,
	DialogTitle,
	Transition,
	TransitionChild,
} from "@headlessui/react";
import { useNavigate } from "@remix-run/react";
import { ListTreeIcon, OctagonXIcon, TriangleAlert } from "lucide-react";
import { Fragment, useState } from "react";
import { useCheckResult, useFiles, useRestart } from "./utils";

export function Toolbar() {
	return (
		<div
			className="fixed bottom-8 h-12 z-50 rounded-full bg-gray-800 px-2 py-1 text-white flex items-center space-x-2 border border-black/10 dark:border-white/10"
			style={{
				left: "50%",
				transform: "translateX(-50%)",
			}}
		>
			<Restart />
			<ListFiles />
			<Diagnostics />
		</div>
	);
}

function Restart() {
	const restart = useRestart();
	const navigate = useNavigate();

	return (
		<button
			type="button"
			onClick={async () => {
				await restart.mutateAsync();
				navigate("/preview");
			}}
			title="Restart preview mode"
			className="size-9 hover:bg-black rounded-full flex items-center justify-center"
		>
			<OctagonXIcon size={20} />
		</button>
	);
}

function ListFiles() {
	const [open, setOpen] = useState(false);
	const files = useFiles(open);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				title="Restart preview mode"
				className="size-9 hover:bg-black rounded-full flex items-center justify-center"
			>
				<ListTreeIcon size={20} />
			</button>
			<Transition appear show={open}>
				<Dialog
					as="div"
					className="relative z-10 focus:outline-none"
					onClose={close}
				>
					<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4">
							<TransitionChild
								enter="ease-out duration-300"
								enterFrom="opacity-0 transform-[scale(95%)]"
								enterTo="opacity-100 transform-[scale(100%)]"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 transform-[scale(100%)]"
								leaveTo="opacity-0 transform-[scale(95%)]"
							>
								<DialogPanel className="w-full max-w-2xl rounded-xl bg-black/80 p-6 backdrop-blur-2xl">
									<DialogTitle
										as="h3"
										className="text-base/7 font-medium text-white"
									>
										File Tree
									</DialogTitle>
									<div className="max-h-[500px] overflow-auto min-w-0">
										<div className="text-sm py-2 px-2 grid grid-cols-2 text-white">
											{Object.keys(files.data || {}).map((key) => (
												<Fragment key={key}>
													<div className="border-b border-gray-200/20 py-1">
														<code>{key}</code>
													</div>
													<div className="border-b border-gray-200/20 py-1">
														{key.replace(".mdx", "").replace("/index", "") ||
															"/"}
													</div>
												</Fragment>
											))}
										</div>
									</div>
									<div className="mt-2">
										<Button
											className="inline-flex items-center gap-2 rounded-md bg-gray-950 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-800 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
											onClick={() => setOpen(false)}
										>
											Close
										</Button>
									</div>
								</DialogPanel>
							</TransitionChild>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}

function Diagnostics() {
	const checks = useCheckResult();
	const [open, setOpen] = useState(false);
	const files = useFiles(open);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				title="View diagnostic information"
				className="relative size-9 hover:bg-black rounded-full flex items-center justify-center"
			>
				<TriangleAlert size={20} />
				{(checks.data?.length ?? 0) > 0 && (
					<div className="absolute text-[10px] font-bold top-1 right-px text-white bg-red-500 px-1 rounded-full">
						{checks.data?.length}
					</div>
				)}
			</button>
			<Transition appear show={open}>
				<Dialog
					as="div"
					className="relative z-10 focus:outline-none"
					onClose={close}
				>
					<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4">
							<TransitionChild
								enter="ease-out duration-300"
								enterFrom="opacity-0 transform-[scale(95%)]"
								enterTo="opacity-100 transform-[scale(100%)]"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 transform-[scale(100%)]"
								leaveTo="opacity-0 transform-[scale(95%)]"
							>
								<DialogPanel className="w-full max-w-2xl rounded-xl bg-black/80 p-6 backdrop-blur-2xl">
									<DialogTitle
										as="h3"
										className="text-base/7 font-medium text-white"
									>
										Diagnostics
									</DialogTitle>
									<div className="max-h-[500px] overflow-auto min-w-0">
										<div className="text-sm py-2 px-2 text-white">
											{(checks.data || []).map((check, i) => (
												<Fragment key={i}>
													<div className="border-b border-gray-200/20 py-1">
														{!!check.filePath && (
															<code>
																{check.filePath}:{check.line}:{check.column}
															</code>
														)}
														<p>{check.message}</p>
													</div>
												</Fragment>
											))}
										</div>
									</div>
									<div className="mt-2">
										<Button
											className="inline-flex items-center gap-2 rounded-md bg-gray-950 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-800 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
											onClick={() => setOpen(false)}
										>
											Close
										</Button>
									</div>
								</DialogPanel>
							</TransitionChild>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
