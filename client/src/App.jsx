import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'

export default function App() {
  return (
    <div>
      <h1>Hello World</h1>

      <header>
        <Show when="signed-out">
          <SignInButton mode='modal' />
          <SignUpButton mode='modal' />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </div>
  )
}
