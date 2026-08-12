declare module '@kirocrew/app-sdk' {
  export function useChatLauncher(): {
    openChat(opts?: { agent?: string; message?: string }): void
  }
  export function useNavigate(): (path: string) => void
  export function useAppApi(): unknown
}
