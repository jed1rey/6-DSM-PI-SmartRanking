import os
import sys

# Assume que os arquivos PKL estão na pasta 'utils'
PKL_FILE_NAME = "df_model_final.pkl"
CURRENT_FILE_DIR = os.path.dirname(os.path.abspath(__file__)) 
PKL_DIR = os.path.join(CURRENT_FILE_DIR, "utils")

if not os.path.exists(os.path.join(PKL_DIR, PKL_FILE_NAME)):
    print("\n\n--- DIAGNÓSTICO DE CAMINHO FALHOU ---")
    print("O Python está procurando os PKLs no caminho:")
    print(os.path.join(PKL_DIR, PKL_FILE_NAME))
    print("\nVocê deve garantir que os arquivos .pkl estejam em:")
    print(PKL_DIR)
else:
    print("\n\n--- DIAGNÓSTICO DE CAMINHO BEM-SUCEDIDO ---")
    print(f"O caminho ABSOLUTO CORRETO para os arquivos PKL é:")
    print(os.path.join(PKL_DIR, PKL_FILE_NAME))