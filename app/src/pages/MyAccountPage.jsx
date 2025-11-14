import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Lock, Edit3, Save, KeyRound } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const MyAccountPage = () => {
  const { user, updateUserProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    address: { street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zip: '' },
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        cpf: user.cpf || '',
        address: user.address || { street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zip: '' },
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };
  
  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setFormData(prev => ({ ...prev, cpf: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await updateUserProfile({
        name: formData.name,
        cpf: formData.cpf,
        address: formData.address,
      });
      toast({ title: "Sucesso!", description: "Seus dados foram atualizados." });
      setIsEditing(false);
    } catch (error) {
      toast({ title: "Erro!", description: "Não foi possível atualizar seus dados.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    if (newPassword !== confirmNewPassword) {
      setPasswordError('As novas senhas não coincidem.');
      return;
    }
    if (!currentPassword || !newPassword) {
      setPasswordError('Por favor, preencha todos os campos de senha.');
      return;
    }

    setIsSaving(true);
    try {
      // Simulate password change. In a real app, this would call an API.
      // For localStorage, we'd need to verify currentPassword against stored user.password
      const users = JSON.parse(localStorage.getItem('cupcakeUsers')) || [];
      const currentUserData = users.find(u => u.id === user.id);

      if (currentUserData && currentUserData.password === currentPassword) {
        await updateUserProfile({ password: newPassword });
        toast({ title: "Sucesso!", description: "Sua senha foi alterada." });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setPasswordError('Senha atual incorreta.');
      }
    } catch (error) {
      toast({ title: "Erro!", description: "Não foi possível alterar sua senha.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || !user) {
    return <LoadingSpinner className="h-[calc(100vh-200px)]" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto py-8"
    >
      <Card className="shadow-2xl bg-white/90 backdrop-blur-sm border-pink-200">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-3xl font-fancy text-pink-600">Minha Conta</CardTitle>
            <CardDescription className="text-pink-500">Gerencie suas informações pessoais e de segurança.</CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)} className="border-pink-500 text-pink-500 hover:bg-pink-50 hover:text-pink-600">
              <Edit3 size={16} className="mr-2" /> Editar Perfil
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Personal Information Section */}
          <section>
            <h2 className="text-xl font-semibold text-pink-700 mb-4 flex items-center"><User size={20} className="mr-2 text-pink-500"/>Informações Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-pink-700">Nome Completo</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500 disabled:bg-pink-50/50" />
              </div>
              <div>
                <Label htmlFor="email" className="text-pink-700">E-mail</Label>
                <Input id="email" name="email" type="email" value={formData.email} disabled className="mt-1 border-pink-300 bg-pink-50/50 cursor-not-allowed" />
              </div>
              <div>
                <Label htmlFor="cpf" className="text-pink-700">CPF</Label>
                <Input id="cpf" name="cpf" value={formData.cpf} onChange={handleCpfChange} placeholder="000.000.000-00" disabled={!isEditing} className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500 disabled:bg-pink-50/50" />
              </div>
            </div>
          </section>

          {/* Address Section */}
          <section>
            <h2 className="text-xl font-semibold text-pink-700 mb-4 flex items-center"><MapPin size={20} className="mr-2 text-pink-500"/>Endereço</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="street" className="text-pink-700">Rua</Label>
                <Input id="street" name="street" value={formData.address.street} onChange={handleAddressChange} disabled={!isEditing} className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500 disabled:bg-pink-50/50" />
              </div>
              <div>
                <Label htmlFor="number" className="text-pink-700">Número</Label>
                <Input id="number" name="number" value={formData.address.number} onChange={handleAddressChange} disabled={!isEditing} className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500 disabled:bg-pink-50/50" />
              </div>
              <div>
                <Label htmlFor="complement" className="text-pink-700">Complemento</Label>
                <Input id="complement" name="complement" value={formData.address.complement} onChange={handleAddressChange} disabled={!isEditing} className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500 disabled:bg-pink-50/50" />
              </div>
              <div>
                <Label htmlFor="neighborhood" className="text-pink-700">Bairro</Label>
                <Input id="neighborhood" name="neighborhood" value={formData.address.neighborhood} onChange={handleAddressChange} disabled={!isEditing} className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500 disabled:bg-pink-50/50" />
              </div>
              <div>
                <Label htmlFor="city" className="text-pink-700">Cidade</Label>
                <Input id="city" name="city" value={formData.address.city} onChange={handleAddressChange} disabled={!isEditing} className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500 disabled:bg-pink-50/50" />
              </div>
              <div>
                <Label htmlFor="state" className="text-pink-700">Estado (UF)</Label>
                <Input id="state" name="state" value={formData.address.state} onChange={handleAddressChange} maxLength="2" disabled={!isEditing} className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500 disabled:bg-pink-50/50" />
              </div>
              <div>
                <Label htmlFor="zip" className="text-pink-700">CEP</Label>
                <Input id="zip" name="zip" value={formData.address.zip} onChange={handleAddressChange} placeholder="00000-000" disabled={!isEditing} className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500 disabled:bg-pink-50/50" />
              </div>
            </div>
          </section>

          {isEditing && (
            <CardFooter className="flex justify-end space-x-3 pt-6">
              <Button variant="outline" onClick={() => { setIsEditing(false); /* Reset form if needed */ }} className="border-gray-400 text-gray-600 hover:bg-gray-100">Cancelar</Button>
              <Button onClick={handleSaveChanges} disabled={isSaving} className="bg-pink-500 hover:bg-pink-600 text-white">
                <Save size={16} className="mr-2"/> {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </CardFooter>
          )}

          {/* Change Password Section */}
          <section className="pt-6 border-t border-pink-200">
            <h2 className="text-xl font-semibold text-pink-700 mb-4 flex items-center"><Lock size={20} className="mr-2 text-pink-500"/>Alterar Senha</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
              </div>
              <div>
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
              </div>
              <div>
                <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
                <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="mt-1 border-pink-300 focus:border-pink-500 focus:ring-pink-500" />
              </div>
              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              <Button onClick={handleChangePassword} disabled={isSaving} className="bg-purple-500 hover:bg-purple-600 text-white">
                <KeyRound size={16} className="mr-2"/> {isSaving ? 'Alterando...' : 'Alterar Senha'}
              </Button>
            </div>
          </section>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MyAccountPage;