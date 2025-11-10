import joblib
import pandas as pd
import numpy as np
import os
import sys

# Assume que os arquivos PKL estão na pasta 'modelos'
# Se você seguiu o último conselho, os arquivos estão em 'modelos/'.
MODEL_DIR = os.path.join(os.getcwd(), "modelos") 
PKL_PATH = os.path.join(MODEL_DIR, "df_model_final.pkl")

print("\n--- DIAGNÓSTICO DE BIBLIOTECAS E CARREGAMENTO ---")

# 1. Teste de Versão (Se falhar, a instalação está errada)
try:
    print(f"✅ joblib Versão: {joblib.__version__}")
    print(f"✅ pandas Versão: {pd.__version__}")
    print(f"✅ numpy Versão: {np.__version__}")
except AttributeError:
    print("❌ ERRO: Bibliotecas instaladas, mas versões não encontradas (cache).")
    
# 2. Teste de Caminho (Se falhar, a pasta/arquivo não existe)
if not os.path.exists(MODEL_DIR):
    print(f"\n❌ ERRO CRÍTICO: Pasta 'modelos/' não encontrada em: {MODEL_DIR}")
    sys.exit(1)

# 3. Teste de Carregamento PKL (Se falhar, o joblib não consegue ler o arquivo)
try:
    if os.path.exists(PKL_PATH):
        print(f"\n✅ Caminho do PKL Encontrado: {PKL_PATH}")
        data = joblib.load(PKL_PATH)
        print(f"✅ Carregamento do PKL BEM-SUCEDIDO! Tipo de dado: {type(data)}")
    else:
        print(f"\n❌ ERRO: Arquivo PKL principal NÃO ENCONTRADO no caminho: {PKL_PATH}")
        print("VERIFIQUE SE OS ARQUIVOS .PKL ESTÃO NA PASTA 'modelos/'")
        
except Exception as e:
    print(f"\n❌ ERRO GRAVE NO JOBLIB: Falha ao abrir o arquivo. Causa: {e}")
    print("Isso geralmente indica um erro no formato de salvamento do PKL.")
    
print("-" * 50)