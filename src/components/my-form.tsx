
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import firebaseApp from "@/utils/firebase/firebase";
import { CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

type TMyForm = {}

export function MyForm(props: TMyForm) {


  const [delay, setDelay] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [token, setToken] = useState('')
  const [permission, setPermission] = useState('default')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTokenGenerating, setIsTokenGenerating] = useState(false)
  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission)
      void generateToken()
    }
  }, [])

  const generateToken = async () => {
    try {
      setIsTokenGenerating(true)
      const messaging = getMessaging(firebaseApp);
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const currentToken = await getToken(messaging, {
        vapidKey:
          'BECY6OCKFyotjM1GkUXqLQrUXX_lwdWfd-FzV2QbCTlRbPNhVz4Y2t66B48Vq17Xp44RGAsss_z_CERZsNWEqjc',
      });
      if (currentToken) {
        setToken(currentToken)
        console.log('token -> ', currentToken)
      } else {
        setToken('')
        console.log(
          'No registration token available. Request permission to generate one.'
        );
      }
    } catch (error) {
      console.error('Error generating token:', error)
    } finally {
      setIsTokenGenerating(false)
    }
  }

  async function handleAskNotifications() {

    if ("Notification" in window) {
      const notificationPermission = Notification.permission;
      if (notificationPermission === "granted") {
        console.log('granted')
        setPermission('granted')
        await generateToken()
      } else {
        console.log('e')
        try {
          const permission = await Notification.requestPermission()
          if (permission === "granted") {
            console.log('granted')
            setPermission('granted')
            await generateToken()
          } else if (permission === 'denied') {
            setPermission('denied')
          } else {
            console.log('Not granted')
          }
        } catch (error) {
          console.error('Error requesting permission:', error)
        }
        console.log(permission)

      }

    } else {
      console.error("NotificationsAPI not supported")
    }
  }

  async function handleSendNotifications() {
    try {
      setIsSubmitting(true)
      await fetch('/api/send-push-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          registrationToken: token,
          title: title,
          body: body,
          delay: Number(delay) ?? 0
        })
      })
    } catch (error) {
      console.error('Error sending notification:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isTokenGenerating) {
    return <Loading/>
  }

  return (
    <div className="mx-auto max-w-md space-y-6 py-12 px-2">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Notification Testing</h1>
        <p className={cn("text-gray-500 dark:text-gray-400", permission !== 'granted' ? 'text-red-500 text-2xl ' : '')}>
          {permission !== 'granted'
            ? 'Please allow notification'
            : 'Configure your notification preferences.'
          }
        </p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="delay">Delay (seconds)</Label>
            <Input
              disabled={permission !== 'granted'}
              id="delay"
              min="0"
              placeholder="Delay in seconds"
              step="1"
              type="number"
              onChange={(e) => setDelay(Number(e.target.value))}
              value={delay ?? undefined}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              disabled={permission !== 'granted'}
              id="title"
              placeholder="Notification title"
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="body">Body</Label>
          <Textarea
            className="min-h-[100px]"
            disabled={permission !== 'granted'}
            id="body"
            placeholder="Notification message"
            onChange={(e) => setBody(e.target.value)}
            value={body}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="link">Token</Label>
          <div className="flex items-center">
            <Input disabled defaultValue={token} className="flex-1" id="link" placeholder="Notification link"
                   type="text"/>
            <Button
              className="ml-2"
              disabled={permission !== 'granted' || !token}
              size="icon"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText((token).toString())
                         .then(() => {
                           toast.info('Copied to clipboard')
                         })
                         .catch((error: string) => {
                           toast.error(`Failed copied to clipboard ${error}`)
                         });
              }}
            >
              <CopyIcon className="h-4 w-4"/>
              <span className="sr-only">Copy link</span>
            </Button>
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <Button
            disabled={!!token}
            variant="outline"
            onClick={(e) => {
              e.preventDefault()
              handleAskNotifications()
            }}
          >
            {permission === 'granted' ? 'Generate Token' : 'Ask Notification'}
          </Button>
          <Button
            disabled={isSubmitting || permission !== 'granted'}
            onClick={(e) => {
              e.preventDefault()
              handleSendNotifications()
            }}
          >
            Send Notification {isSubmitting && '...'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export const Loading = () => {
  return (
    <div className='flex space-x-2 justify-center items-center bg-white h-screen dark:invert'>
      <span className='sr-only'>Loading...</span>
      <div
        className='h-8 w-8 bg-gradient-to-b from-[#2e026d] to-[#15162c] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
      <div
        className='h-8 w-8 bg-gradient-to-b from-[#2e026d] to-[#15162c] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
      <div className='h-8 w-8 bg-gradient-to-b from-[#2e026d] to-[#15162c] rounded-full animate-bounce'></div>
    </div>
  )
}
