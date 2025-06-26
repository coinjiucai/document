<template>
  <ClientOnly>
    <div
      :class="cn('w-full', $props.class)"
      @dragover.prevent="handleEnter"
      @dragleave="handleLeave"
      @drop.prevent="handleDrop"
      @mouseover="handleEnter"
      @mouseleave="handleLeave"
    >
      <div
        class="group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-10"
        @click="handleClick"
      >
        <input
          ref="fileInputRef"
          type="file"
          class="hidden"
          @change="onFileChange"
        />

        <!-- Grid pattern -->
        <div
          class="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"
        >
          <slot />
        </div>

        <!-- Content -->
        <div class="flex flex-col items-center justify-center">
          <div class="relative mx-auto w-full max-w-xl space-y-4">
            <Motion
              as="div"
              class="box relative z-40 mx-auto mt-4 flex w-full items-center justify-center rounded-md bg-white shadow-[0px_10px_50px_rgba(0,0,0,0.1)] group-hover/file:shadow-2xl dark:bg-neutral-900"
              :initial="{
                x: 0,
                y: 0,
                opacity: 1,
              }"
              :transition="{
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }"
              :animate="
                isActive
                  ? {
                      x: 20,
                      y: -20,
                      opacity: 0.9,
                    }
                  : {}
              "
            >
              <el-icon style="color: #333"><Upload/></el-icon>
            </Motion>
            <div
              class="box absolute inset-0 z-30 mx-auto mt-4 flex  w-full items-center justify-center rounded-md border border-dashed border-sky-400 bg-transparent transition-opacity"
              :class="{ 'opacity-100': isActive, 'opacity-0': !isActive }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { Motion } from "motion-v";
import { ref } from "vue";

interface FileUploadProps {
  class?: HTMLAttributes["class"];
}

defineProps<FileUploadProps>();

const emit = defineEmits<{
  (e: "onChange", files: File[]): void;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const files = ref<File[]>([]);
const isActive = ref<boolean>(false);

function handleFileChange(newFiles: File[]) {
  files.value = [...files.value, ...newFiles];
  emit("onChange", files.value);
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files) return;
  handleFileChange(Array.from(input.files));
}

function handleClick() {
  fileInputRef.value?.click();
}

function handleEnter() {
  isActive.value = true;
}
function handleLeave() {
  isActive.value = false;
}
function handleDrop(e: DragEvent) {
  isActive.value = false;
  const droppedFiles = e.dataTransfer?.files
    ? Array.from(e.dataTransfer.files)
    : [];
  if (droppedFiles.length) handleFileChange(droppedFiles);
}
</script>

<style scoped>
.group-hover\/file\:shadow-2xl:hover {
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.25);
}

.transition-opacity {
  transition: opacity 0.3s ease;
}
.box {
  width: 200px;
  height: 200px;
  border-radius: 10px;
}
</style>