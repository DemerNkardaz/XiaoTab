import { ref } from 'vue';

export function useBackup() {
  const isProcessing = ref(false);
  const error = ref<string | null>(null);

  async function exportBackup() {
    isProcessing.value = true;
    error.value = null;
    try {
      const { exportAll, downloadExport } = await import('@/io/export');
      const blob = await exportAll();
      downloadExport(blob);
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
    } finally {
      isProcessing.value = false;
    }
  }

  async function importBackup(file: File) {
    isProcessing.value = true;
    error.value = null;
    try {
      const { importAll } = await import('@/io/import');
      return await importAll(file);
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
      return null;
    } finally {
      isProcessing.value = false;
    }
  }

  return { isProcessing, error, exportBackup, importBackup };
}
