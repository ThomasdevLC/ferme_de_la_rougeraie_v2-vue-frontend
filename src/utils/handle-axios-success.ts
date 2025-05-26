// src/utils/handle-axios-success.ts
import type { AxiosResponse } from 'axios'

export function handleAxiosSuccess(response: AxiosResponse) {
  return response.data.message as string
}
