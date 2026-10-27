import { Button, Modal, useOverlayState } from "@heroui/react";
import { ExternalLinkIcon, XIcon } from "lucide-react";
import { withTransform } from "../../lib/imagekit.js";
import { MessageVideo } from "./MessageVideo.jsx";

const IMAGE_TRANSFORM = "q-auto,w-640,f-auto";

export function MessageBubble({ message }) {
  const imageViewer = useOverlayState();
  const isOwnMessage = message.role === "me";
  const hasImage = Boolean(message.imageUrl);
  const hasVideo = Boolean(message.videoUrl);

  return (
    <div className={`flex w-full ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[min(90%,28rem)] rounded-2xl px-3 py-2 text-[15px] leading-snug sm:max-w-[min(75%,28rem)] sm:px-3.5 ${isOwnMessage
          ? "rounded-br-md bg-accent text-accent-foreground"
          : "rounded-bl-md bg-surface"
          }`}
      >
        {hasImage ? (
          <button
            type="button"
            onClick={imageViewer.open}
            aria-label="View image"
            className="mb-1.5 block cursor-zoom-in overflow-hidden rounded-lg text-left"
          >
            <img
              src={withTransform(message.imageUrl, IMAGE_TRANSFORM)}
              alt="Shared image. Select to view full size."
              className="max-h-52 max-w-full rounded-lg object-cover sm:max-h-72 sm:rounded-xl"
            />
          </button>
        ) : null}
        {hasVideo ? <MessageVideo src={message.videoUrl} /> : null}
        {message.text ? (
          <p className="whitespace-pre-wrap wrap-break-word">{message.text}</p>
        ) : null}
        <p
          className={`mt-1 text-[11px] tabular-nums ${isOwnMessage ? "text-accent-foreground/75" : "text-muted"
            }`}
        >
          {message.time}
        </p>
      </div>

      {hasImage ? (
        <Modal.Root state={imageViewer}>
          <Modal.Backdrop>
            <Modal.Container size="full" placement="center">
              <Modal.Dialog className="h-dvh max-h-dvh w-screen max-w-screen bg-black/95 p-3 text-white">
                <Modal.Header className="flex items-center justify-end gap-2">
                  <a
                    href={message.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open original image in a new tab"
                    className="rounded-full p-2 hover:bg-white/10"
                  >
                    <ExternalLinkIcon className="size-5" />
                  </a>
                  <Button
                    variant="ghost"
                    isIconOnly
                    aria-label="Close image"
                    onPress={imageViewer.close}
                  >
                    <XIcon className="size-5" />
                  </Button>
                </Modal.Header>
                <Modal.Body className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
                  <img
                    src={message.imageUrl}
                    alt="Shared image full size"
                    className="max-h-full max-w-full object-contain"
                  />
                </Modal.Body>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal.Root>
      ) : null}
    </div>
  );
}
