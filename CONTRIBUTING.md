# Contributing

## Before

Before creating a Pull Request, please contact us at [issues](https://github.com/moeru-ai/xsai/issues) or [discussions](https://github.com/moeru-ai/xsai/discussions) to confirm that the feature in question is one we need.

When creating a Pull Request, please make sure you have read and agreed to it:

- Allow us (xsAI Maintainers) to modify your code at any time.
  - Usually, this is to make it simpler, but there may be exceptions.
- Allow us (xsAI Maintainers) to create new Pull Request with your code and close the old ones while adding the `Co-authored-by` trailers.

We will do our best to try to explain and discuss the possible implementation approaches as much detailed as possible before modifications and Pull Request state changes,
but still, sometimes it may be much more efficient for us to directly use actual code to address our opinions.

## Testing

We weren't supposed to connect to OpenAI's paid APIs while testing, so we chose some local services to use for test:

### embed, {generate,stream}Text, {generate,stream}Object, tool

It uses [Ollama](https://github.com/ollama/ollama).

The model used may change as needed, currently `nomic-embed-text`, `llama3.2`, `deepseek-r1:1.5b` and `mistral-nemo`.

```bash
ollama pull nomic-embed-text
ollama pull llama3.2
ollama pull deepseek-r1:1.5b
ollama pull mistral-nemo
ollama serve
```

### generateSpeech

It uses [openai-edge-tts](https://github.com/travisvn/openai-edge-tts).

You can quickly start one via `docker` or `docker-compose`:

```bash
docker run --rm -p 5050:5050 -e PORT=5050 travisvn/openai-edge-tts:latest
```

```yaml
services:
  openai-edge-tts:
    image: travisvn/openai-edge-tts:latest
    ports:
      - 5050:5050
```

### generateTranscription

It uses [whisper.cpp](https://github.com/ggerganov/whisper.cpp) and the `ggml-large-v3-turbo-q5_0` model.

If you're using Nix, you can do this:

```nix
{ pkgs, ... }: {
  home.packages = with pkgs; [ openai-whisper-cpp ];
}
```

Then store the model files in the directory you want and start the server:

```bash
mkdir models
cd models
whisper-cpp-download-ggml-model large-v3-turbo-q5_0
cd ..
whisper-cpp-server --host 127.0.0.1 --port 9010 -nt -m models/ggml-large-v3-turbo-q5_0.bin --request-path /audio/transcriptions --inference-path ""
```
