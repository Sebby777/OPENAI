import { fetchSSE, getSettings } from '../utils'
import { AbstractEngine } from './abstract-engine'
import { IMessageRequest, IModel } from './interfaces'

let lastSendTime = 0;
export class Dify extends AbstractEngine {

    async listModels(_apiKey: string | undefined): Promise<IModel[]> {
        return []
    }

    async getModel(): Promise<string> {
        const settings = await getSettings()
        return settings.difyModel || 'dify-translator'
    }

    async sendMessage(req: IMessageRequest): Promise<void> {
        const now = Date.now();
        if (now - lastSendTime < 2000) {
            console.warn('请求过于频繁，已忽略本次请求');
            return;
        }
        lastSendTime = now;

        const settings = await getSettings()
        const apiKey = settings.difyAPIKey
        const apiURL = settings.difyAPIURL || 'https://api.dify.ai'
        const url = `${apiURL}/workflows/run`

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        }

        const inputs: any = {
            query: req.rolePrompt ? req.rolePrompt + '\n\n' + req.commandPrompt : req.commandPrompt,
        }
        if (req.imageId) {
            inputs.image = {
                transfer_method: 'local_file',
                upload_file_id: req.imageId,
                type: 'image'
            }
        }
        const body = {
            inputs,
            response_mode: "streaming",
            user: "translation-user",
            stream: true
        }

        let finished = false;

        try {
            await fetchSSE(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
                signal: req.signal,
                onStatusCode: (status) => {
                    req.onStatusCode?.(status)
                },
                onMessage: async (rawData) => {
                    if (finished) return;

                    const lines = rawData.split('\n').filter(line => line.trim() !== '');

                    for (const line of lines) {
                        try {
                            const event = JSON.parse(line);

                            if (event.event === 'text_chunk' && event.data?.text) {
                                req.onMessage?.({ content: event.data.text, role: '' });
                            }
                            else if (event.event === 'workflow_finished') {
                                finished = true;
                                // 添加 onFinished 回调

                            }
                            // 添加错误事件处理
                            else if (event.event === 'error') {
                                finished = true;
                                req.onError?.(event.error?.message || 'Dify API error');
                                req.onFinished?.('error');
                            }
                        } catch (e) {
                            console.warn('解析单行JSON失败:', e, '原始数据:', line);
                        }
                    }
                },
                onError: (err) => {
                    if (finished) return;

                    console.error('流错误:', err);
                    const errorMsg = err instanceof Error ? err.message :
                        typeof err === 'string' ? err :
                            '未知流错误';

                    req.onError?.(errorMsg);
                    req.onFinished?.('error');
                    finished = true;
                }
            });
        } catch (e) {
            if (finished) return;

            const msg = e instanceof Error ? e.message :
                typeof e === 'string' ? e :
                    e ? JSON.stringify(e) : '未知请求错误';

            console.error('请求错误:', msg);
            req.onError?.(msg);
            req.onFinished?.('error');
        } finally {
            // 确保总是调用 onFinished
            if (!finished) {
                req.onFinished?.('timeout');
            }
        }
    }
}
