using System;
using System.Drawing;
using System.Windows.Forms;

namespace NextBusNL
{
    public class SysTrayApp : Form
    {
        #region fields

        private readonly NotifyIcon _trayIcon;
        private readonly NextBusDialog _nextBusDialog;

        #endregion

        #region constructors

        public SysTrayApp()
        {
            // Create a simple tray menu with only one item.
            ContextMenu trayMenu = new ContextMenu();
            trayMenu.MenuItems.Add("Exit", OnExit);

            // Create a tray icon. In this example we use a
            // standard system icon for simplicity, but you
            // can of course use your own custom icon too.
            _trayIcon = new NotifyIcon();
            _trayIcon.Text = "NextBusNL";
            _trayIcon.Icon = new Icon(this.Icon, 40, 40);

            // Add menu to tray icon and show it.
            _trayIcon.ContextMenu = trayMenu;
            _trayIcon.MouseClick += SysTrayAppMouseClick;
            _trayIcon.Visible = true;

            _nextBusDialog = new NextBusDialog();
        }

        #endregion

        #region protected methods

        protected override void OnLoad(EventArgs e)
        {
            Visible = false; // Hide form window.
            ShowInTaskbar = false; // Remove from taskbar.

            base.OnLoad(e);
        }

        private void OnExit(object sender, EventArgs e)
        {
            Application.Exit();
        }

        protected override void Dispose(bool isDisposing)
        {
            if (isDisposing)
            {
                // Release the icon resource.
                _trayIcon.Dispose();
            }

            base.Dispose(isDisposing);
        }

        #endregion

        #region private methods
        private void SysTrayAppMouseClick(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                _nextBusDialog.ShowDialog();
            }
        }

        #endregion

    }
}
